from flask import Blueprint, session, jsonify, request, redirect
from utils.stream_utils import *
from utils.recommendation_utils import *
from utils.user_utils import get_user_id
from blueprints.utils import login_required
from database.database import Database
from datetime import datetime
from celery_tasks import update_thumbnail

stream_bp = Blueprint("stream", __name__)

# Constants
THUMBNAIL_GENERATION_INTERVAL = 180


## Stream Routes
@stream_bp.route('/streams/popular/<int:no_streams>')
def get_popular_streams(no_streams) -> list[dict]:
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
def get_popular_streams_by_category(category_name) -> list[dict]:
    """
    Returns a list of streams live now with the highest viewers in a given category
    """

    category_id = get_category_id(category_name)
    print(category_id, flush=True)
    streams = get_streams_based_on_category(category_id)
    return jsonify(streams)

@login_required 
@stream_bp.route('/streams/recommended')
def get_recommended_streams() -> list[dict]:
    """
    Queries DB to get a list of recommended streams using an algorithm
    """

    user_id = session.get("user_id")

    # Get the user's most popular categories
    category = get_user_preferred_category(user_id)
    streams = get_streams_based_on_category(category)
    return streams

@stream_bp.route('/streams/<int:streamer_id>/data')
def get_stream_data(streamer_id):
    """
    Returns a streamer's current stream data
    """
    
    return jsonify(get_current_stream_data(streamer_id))


## Category Routes
@stream_bp.route('/categories/popular/<int:no_categories>')
def get_popular_categories(no_categories) -> list[dict]:
    """
    Returns a list of most popular categories
    """
    # Limit the number of categories to 100
    if no_categories < 1:
        return jsonify([])
    elif no_categories > 100:
        no_categories = 100

    category_data = get_highest_view_categories(no_categories)
    return jsonify(category_data)

@login_required 
@stream_bp.route('/categories/recommended')
def get_recommended_categories() -> list | list[dict]:
    """
    Queries DB to get a list of recommended categories for the user

    """
    user_id = session.get("user_id")
    categories = get_user_category_recommendations(user_id)
    return jsonify(categories)

@login_required
@stream_bp.route('/categories/following')
def get_following_categories_streams():
    """
    Returns popular streams in categories which the user followed
    """

    streams = followed_categories_recommendations(session.get('user_id'))
    return jsonify(streams)


## User Routes
@stream_bp.route('/user/<string:username>/status')
def get_user_live_status(username):
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
        "most_recent_stream": most_recent_vod
    })


## VOD Routes
@stream_bp.route('/vods/<string:username>')
def get_vods(username):
    """
    Returns a JSON of all the vods of a streamer
    """
    user_id = get_user_id(username)
    vods = get_user_vods(user_id)
    return jsonify(vods)


## RTMP Server Routes
@stream_bp.route("/publish_stream", methods=["POST"])
def publish_stream():
    """
    Authenticates stream from streamer and publishes it to the site
    """
    stream_key = request.form.get("name")

    # Check if stream key is valid
    db = Database()
    user_info = db.fetchone("""SELECT user_id, username, current_stream_title, current_selected_category_id 
                               FROM users 
                               WHERE stream_key = ?""", (stream_key,))

    if not user_info:
        return "Unauthorized", 403
    
    # Insert stream into database
    db.execute("""INSERT INTO streams (user_id, title, category_id, start_time, isLive)
                  VALUES (?, ?, ?, ?, ?)""", (user_info["user_id"], 
                                           user_info["current_stream_title"],
                                           1,
                                           datetime.now(),
                                           1))
    
    update_thumbnail.delay(user_info["user_id"])

    return redirect(f"/{user_info['username']}")

@stream_bp.route("/end_stream", methods=["POST"])
def end_stream():
    """
    Ends a stream
    """
    db = Database()

    # get stream key
    user_info = db.fetchone("""SELECT user_id FROM users WHERE stream_key = ?""", (request.form.get("name"),))
    stream_info = db.fetchone("""SELECT stream_id FROM streams WHERE user_id = ?""", (user_info["user_id"],))

    if not user_info:
        return "Unauthorized", 403
    
    # Remove stream from database
    db.execute("""DELETE FROM streams WHERE user_id = ?""", (user_info["user_id"],))

    return "Stream ended", 200