from flask import Blueprint, session, jsonify, request, redirect
from utils.stream_utils import *
from utils.recommendation_utils import *
from utils.user_utils import get_user_id
from blueprints.middleware import login_required
from database.database import Database
from datetime import datetime
from celery_tasks.streaming import update_thumbnail, combine_ts_stream
from dateutil import parser
from utils.path_manager import PathManager
from PIL import Image
import json

stream_bp = Blueprint("stream", __name__)

# Constants
THUMBNAIL_GENERATION_INTERVAL = 180

# Path Manager
path_manager = PathManager()

# Stream Routes


@stream_bp.route('/streams/popular/<int:no_streams>')
def popular_streams(no_streams) -> list[dict]:
    """
    Returns a list of streams live now with the highest viewers
    """

    # Limit the number of streams to MAX_STREAMS
    MAX_STREAMS = 100
    if no_streams < 1:
        return jsonify([])
    elif no_streams > MAX_STREAMS:
        no_streams = MAX_STREAMS

    # Get the highest viewed streams
    streams = get_highest_view_streams(no_streams)
    return jsonify(streams)


@stream_bp.route('/streams/popular/<string:category_name>')
@stream_bp.route('/streams/popular/<string:category_name>/<int:no_streams>/<int:offset>')
def popular_streams_by_category(category_name, no_streams=4, offset=0) -> list[dict]:
    """
    Returns a list of streams live now with the highest viewers in a given category
    """

    category_id = get_category_id(category_name)

    streams = get_streams_based_on_category(category_id, no_streams, offset)
    return jsonify(streams)


@login_required
@stream_bp.route('/streams/recommended')
def recommended_streams() -> list[dict]:
    """
    Queries DB to get a list of recommended streams using an algorithm
    """

    user_id = session.get("user_id")
    # Get the user's most popular categories
    category = get_user_preferred_category(user_id)
    streams = get_streams_based_on_category(category)
    return streams


@stream_bp.route('/streams/<string:username>/data')
@stream_bp.route('/streams/<int:streamer_id>/data')
def stream_data(username=None, streamer_id=None) -> dict:
    """
    Returns a streamer's current stream data
    """
    if username and not streamer_id:
        streamer_id = get_user_id(username)
    data = get_current_stream_data(streamer_id)

    # If the user is the streamer, return the stream key also
    if session.get('user_id') == streamer_id:
        with Database() as db:
            stream_key = db.fetchone(
                """SELECT stream_key FROM users WHERE user_id = ?""", (streamer_id,))
            if data:
                data["stream_key"] = stream_key["stream_key"]
            else:
                data = {"stream_key": stream_key["stream_key"]}

    return jsonify(data)


# Category Routes
@stream_bp.route('/categories/popular/<int:no_categories>')
@stream_bp.route('/categories/popular/<int:no_categories>/<int:offset>')
def popular_categories(no_categories=4, offset=0) -> list[dict]:
    """
    Returns a list of most popular categories
    """

    # Limit the number of categories to 100
    if no_categories < 1:
        return jsonify([])
    elif no_categories > 100:
        no_categories = 100

    category_data = get_highest_view_categories(no_categories, offset)
    return jsonify(category_data)


@login_required
@stream_bp.route('/categories/recommended')
def recommended_categories() -> list | list[dict]:
    """
    Queries DB to get a list of recommended categories for the user

    """
    user_id = session.get("user_id")
    categories = get_user_category_recommendations(user_id)
    return jsonify(categories)


@login_required
@stream_bp.route('/streams/followed_categories')
def following_categories_streams():
    """
    Returns popular streams from categories the user is following
    """

    streams = get_followed_categories_recommendations(session.get('user_id'))
    return jsonify(streams)


# User Routes
@stream_bp.route('/user/<string:username>/status')
def user_live_status(username):
    """
    Returns a streamer's status, if they are live or not and their most recent stream (as a vod) (their current stream if live)
    Returns:
    {
        "is_live": bool,
        "most_recent_stream": dict,
        "user_id": int
    }
    """
    user_id = get_user_id(username)

    # Check if streamer is live and get their most recent vod
    is_live = True if get_streamer_live_status(user_id)['is_live'] else False
    most_recent_vod = get_latest_vod(user_id)

    # If there is no most recent vod, set it to None
    if not most_recent_vod:
        most_recent_vod = None

    return jsonify({
        "is_live": is_live,
        "most_recent_stream": most_recent_vod,
        "user_id": user_id
    })

@stream_bp.route('/user/<string:username>/direct_live_status')
def user_live_status_direct(username):
    """
    Returns a streamer's status, if they are live or not
    Returns:
    {
        "is_live": bool,
        "user_id": int
    }
    """

    user_id = get_user_id(username)
    is_live = True if get_streamer_live_status(user_id)['is_live'] else False

    if is_live:
        return 'ok', 200
    else:
        return 'not live', 404


# VOD Routes
@stream_bp.route('/vods/<int:vod_id>')
def vod(vod_id):
    """
    Returns details about a specific vod
    """
    vod = get_vod(vod_id)
    return jsonify(vod)

@stream_bp.route('/vods/<string:username>')
def vods(username):
    """
    Returns a JSON of all the vods of a streamer
    Returns:
    [
        {
            "vod_id": int,
            "title": str,
            "datetime": str,
            "username": str,
            "category_name": str,
            "length": int (in seconds),
            "views": int
        }
    ]
    
    """
    user_id = get_user_id(username)
    vods = get_user_vods(user_id)
    return jsonify(vods)

@stream_bp.route('/vods/all')
def get_all_vods():
    """
    Returns data of all VODs by all streamers in a JSON-compatible format
    """
    with Database() as db:
        vods = db.fetchall("""SELECT vods.*, username, category_name FROM vods JOIN users ON vods.user_id = users.user_id JOIN categories ON vods.category_id = categories.category_id;""")
        
    return jsonify(vods)

# RTMP Server Routes

@stream_bp.route("/init_stream", methods=["POST"])
def init_stream():
    """
    Called by NGINX when OBS starts streaming.
    Creates necessary directories and validates stream key.
    """
    stream_key = request.form.get("name")

    with Database() as db:
        # Check if valid stream key and user is allowed to stream
        user_info = db.fetchone("""SELECT user_id, username, is_live 
                                FROM users 
                                WHERE stream_key = ?""", (stream_key,))

        # No user found from stream key
        if not user_info:
            print("Unauthorized - Invalid stream key", flush=True)
            return "Unauthorized - Invalid stream key", 403

    username = user_info["username"]

    # FOR TESTING
    path_manager.create_user(username)

    print(f"Stream initialization requested in nginx with key: {stream_key}", flush=True)

    return redirect(username + "/" + path_manager.stream_directory_name)


@stream_bp.route("/publish_stream", methods=["POST"])
def publish_stream():
    """
    Called when user clicks Start Stream in dashboard.
    Sets up stream in database and starts thumbnail generation.

    step-by-step:
    fetch user info from stream key
    insert stream into database
    set user as streaming
    periodically update thumbnail
    """

    try:
        data = json.loads(request.form.get("data"))
    except json.JSONDecodeError as ex:
        print(f"Error: {ex}")
    except KeyError as ex:
        print(f"Error: {ex}")

    stream_key = data.get("streamKey")
    stream_title = data.get("title")
    stream_category = data.get("streamCategory")
    stream_thumbnail = data.get("thumbnail")

    user_id = None
    username = None

    with Database() as db:
        user_info = db.fetchone("""SELECT user_id, username, is_live
                                FROM users 
                                WHERE stream_key = ?""", (stream_key,))

        if not user_info or user_info.get("is_live"):
            print(
                "Unauthorized. No user found from Stream key or user is already streaming.", flush=True)
            return "Unauthorized", 403

        user_id = user_info.get("user_id")
        username = user_info.get("username")

        # Insert stream into database
        db.execute("""INSERT INTO streams (user_id, title, start_time, num_viewers, category_id)
                    VALUES (?, ?, ?, ?, ?)""", (user_id,
                                                stream_title,
                                                datetime.now(),
                                                0,
                                                get_category_id(stream_category)))

        # Set user as streaming
        db.execute("""UPDATE users SET is_live = 1 WHERE user_id = ?""",
                   (user_id,))

    # Update thumbnail periodically only if a custom thumbnail is not provided
    if not stream_thumbnail:
        update_thumbnail.apply_async((user_id,
                           path_manager.get_stream_file_path(username),
                           path_manager.get_current_stream_thumbnail_file_path(username),
                           THUMBNAIL_GENERATION_INTERVAL), countdown=10)

    return "OK", 200


@stream_bp.route("/update_stream", methods=["POST"])
def update_stream():
    """
    Called by StreamDashboard to update stream info
    """
    # TODO: Add thumbnails (paths) to table, allow user to update thumbnail

    print("Updating stream info", flush=True)
    print(f"request.json: {request.is_json}", flush=True)

    data = request.get_json()
    stream_key = data.get("key")
    stream_title = data.get("title")
    stream_category = data.get("category_name")
    stream_thumbnail = data.get("thumbnail")


    with Database() as db:
        user_info = db.fetchone("""SELECT user_id, username, is_live 
                                FROM users 
                                WHERE stream_key = ?""", (stream_key,))

        if not user_info or not user_info.get("is_live"):
            print(
                "Unauthorized - No user found from stream key or user is not streaming", flush=True)
            return "Unauthorized", 403

        user_id = user_info.get("user_id")
        username = user_info.get("username")

        # TODO: Add update to thumbnail here
        db.execute("""UPDATE streams 
                   SET title = ?, category_id = ?
                   WHERE user_id = ?""", (stream_title, get_category_id(stream_category), user_id))
        
        print("GOT: " + stream_thumbnail, flush=True)
        
        if stream_thumbnail:
            # Set custom thumbnail status to true
            db.execute("""UPDATE streams
                        SET custom_thumbnail = ?
                        WHERE user_id = ?""", (True, user_id))
            
            # Get thumbnail path
            thumbnail_path = path_manager.get_current_stream_thumbnail_file_path(username)

            # Fetch image, convert to png, and save
            image = Image.open(stream_thumbnail)
            image.convert('RGB')
            image.save(thumbnail_path, "PNG")

            print(f"Should have saved it to {thumbnail_path}", flush=True)

    return "Stream updated", 200


@stream_bp.route("/end_stream", methods=["POST"])
def end_stream():
    """
    Ends a stream based on the HTTP request
    """
    print("Ending stream", flush=True)

    if request.is_json:
        # stream key from StreamDashboard
        stream_key = request.get_json().get("key")
    else:
        # stream key from OBS
        stream_key = request.form.get("name")

    if stream_key is None:
        print("Unauthorized - No stream key provided", flush=True)
        return "Unauthorized", 403

    # Get user info from stream key
    with Database() as db:
        user_info = db.fetchone("""SELECT user_id, username
                                FROM users 
                                WHERE stream_key = ?""", (stream_key,))
        
        # Return unauthorized if no user found
        if not user_info:
            print("Unauthorized - No user found from stream key", flush=True)
            return "Unauthorized", 403
            
        # Get user info
        user_id = user_info["user_id"]
        username = user_info["username"]
    
    # End stream
    result, message = end_user_stream(stream_key, user_id, username)
    
    # Return error if stream could not be ended
    if not result:
        print(f"Error ending stream: {message}", flush=True)
        return "Error ending stream", 500
    
    print(f"Stream ended: {message}", flush=True)
    return "Stream ended", 200
