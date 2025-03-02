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
import json

stream_bp = Blueprint("stream", __name__)

# Constants
THUMBNAIL_GENERATION_INTERVAL = 10

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


@stream_bp.route('/streams/<int:streamer_id>/data')
def stream_data(streamer_id) -> dict:
    """
    Returns a streamer's current stream data
    """
    data = get_current_stream_data(streamer_id)

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
    print(no_categories, offset, flush=True)
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
    categories = get_user_category_recommendations(1)
    return jsonify(categories)


@login_required
@stream_bp.route('/categories/following')
def following_categories_streams():
    """
    Returns popular streams in categories which the user followed
    """

    streams = get_followed_categories_recommendations(session.get('user_id'))
    return jsonify(streams)


@login_required
@stream_bp.route('/categories/your_categories')
def following_your_categories():
    """
    Returns categories which the user followed
    """

    streams = get_followed_your_categories(session.get('user_id'))
    return jsonify(streams)



# User Routes
@stream_bp.route('/user/<string:username>/status')
def user_live_status(username):
    """
    Returns a streamer's status, if they are live or not and their most recent stream (as a vod) (their current stream if live)
    """
    user_id = get_user_id(username)

    # Check if streamer is live and get their most recent vod
    is_live = True if get_streamer_live_status(user_id)['is_live'] else False
    most_recent_vod = get_latest_vod(user_id)

    # If there is no most recent vod, set it to None
    if not most_recent_vod:
        most_recent_vod = None
    else:
        most_recent_vod = most_recent_vod['vod_id']

    return jsonify({
        "is_live": is_live,
        "most_recent_stream": most_recent_vod,
        "user_id": user_id
    })


# VOD Routes
@stream_bp.route('/vods/<string:username>')
def vods(username):
    """
    Returns a JSON of all the vods of a streamer
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
        vods = db.fetchall("SELECT * FROM vods")
    
    print("Fetched VODs from DB:", vods)
    
    return jsonify(vods)

# RTMP Server Routes

@stream_bp.route("/init_stream", methods=["POST"])
def init_stream():
    """
    Called by NGINX when OBS starts streaming.
    Creates necessary directories and validates stream key.
    """
    stream_key = request.form.get("name")

    print(f"Stream initialization requested in nginx with key: {stream_key}", flush=True)

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

    stream_key = data.get("stream_key")
    stream_title = data.get("title")
    stream_category = data.get("category_name")

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

    # Update thumbnail periodically
    update_thumbnail.delay(user_id,
                           path_manager.get_stream_file_path(username),
                           path_manager.get_current_stream_thumbnail_file_path(username),
                           THUMBNAIL_GENERATION_INTERVAL)

    return "OK", 200


@stream_bp.route("/update_stream", methods=["POST"])
def update_stream():
    """
    Called by StreamDashboard to update stream info
    """
    # TODO: Add thumbnails (paths) to table, allow user to update thumbnail

    print("Updating stream info", flush=True)

    data = request.get_json()
    stream_key = data.get("key")
    stream_title = data.get("title")
    stream_category = data.get("category_name")
    # TODO stream_thumbnail = data.get("thumbnail")

    user_id = None

    with Database() as db:
        user_info = db.fetchone("""SELECT user_id, username, is_live 
                                FROM users 
                                WHERE stream_key = ?""", (stream_key,))

        if not user_info or not user_info.get("is_live"):
            print(
                "Unauthorized - No user found from stream key or user is not streaming", flush=True)
            return "Unauthorized", 403

        user_id = user_info.get("user_id")

        # TODO: Add update to thumbnail here
        db.execute("""UPDATE streams 
                   SET title = ?, category_id = ?
                   WHERE user_id = ?""", (stream_title, get_category_id(stream_category), user_id))

    return "Stream updated", 200


@stream_bp.route("/end_stream", methods=["POST"])
def end_stream():
    """
    Ends a stream

    step-by-step:
    remove stream from database
    move stream to vod table
    set user as not streaming
    convert ts files to mp4
    clean up old ts files
    end thumbnail generation
    """

    print("Ending stream", flush=True)

    stream_key = request.get_json().get("key")
    user_id = None
    username = None

    if not stream_key:
        # Try getting stream_key from form data (for nginx in the case that the stream is ended on OBS's end)
        stream_key = request.form.get("name")

    if stream_key is None:
        print("Unauthorized - No stream key provided", flush=True)
        return "Unauthorized", 403

    # Open database connection
    with Database() as db:
        initial_streams = db.fetchall("""SELECT title FROM streams""")
        print("Initial streams:", initial_streams, flush=True)

        # Get user info from stream key
        user_info = db.fetchone("""SELECT *
                                FROM users 
                                WHERE stream_key = ?""", (stream_key,))

        stream_info = db.fetchone("""SELECT *
                                FROM streams
                                WHERE user_id = ?""", (user_id,))

        print("Got stream_info", stream_info, flush=True)

        # If stream key is invalid, return unauthorized
        if not user_info:
            print("Unauthorized - No user found from stream key", flush=True)
            return "Unauthorized", 403
        # If stream never published, return
        if not stream_info:
            print(f"Stream for stream key: {stream_key} never began", flush=True)
            return "Stream ended", 200

        # Remove stream from database
        db.execute("""DELETE FROM streams 
                   WHERE user_id = ?""", (user_id,))

        # Move stream to vod table
        stream_length = int(
            (datetime.now() - parser.parse(stream_info.get("start_time"))).total_seconds())

        db.execute("""INSERT INTO vods (user_id, title, datetime, category_id, length, views)
                    VALUES (?, ?, ?, ?, ?, ?)""", (user_id,
                                                   stream_info.get("title"),
                                                   stream_info.get(
                                                       "start_time"),
                                                   stream_info.get(
                                                       "category_id"),
                                                   stream_length,
                                                   0))

        vod_id = db.get_last_insert_id()

        # Set user as not streaming
        db.execute("""UPDATE users 
                   SET is_live = 0 
                   WHERE user_id = ?""", (user_id,))

        current_streams = db.fetchall("""SELECT title FROM streams""")

    combine_ts_stream.delay(path_manager.get_stream_path(
        username), path_manager.get_vods_path(username), vod_id)

    print("Stream ended. Current streams now:", current_streams, flush=True)
    return "Stream ended", 200
