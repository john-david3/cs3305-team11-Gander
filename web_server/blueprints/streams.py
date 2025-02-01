from flask import Blueprint, session, jsonify, g, request, redirect, abort, send_from_directory
from utils.stream_utils import (
    streamer_live_status,
    streamer_most_recent_stream,
    user_stream,
    followed_live_streams,
    followed_streamers,
    stream_tags,
    streamer_data
)
from utils.user_utils import get_user_id
from blueprints.utils import login_required
from utils.recommendation_utils import (
    default_recommendations, 
    recommendations_based_on_category, 
    user_recommendation_category, 
    followed_categories_recommendations, 
    category_recommendations,
    user_category_recommendations
)
from utils.utils import most_popular_category
from database.database import Database
from datetime import datetime

from celery_tasks import update_thumbnail

stream_bp = Blueprint("stream", __name__)

# Constants
THUMBNAIL_GENERATION_INTERVAL = 180

@stream_bp.route('/get_streams')
def get_sample_streams() -> list[dict]:
    """
    Returns a list of streams live now with the highest viewers
    """

    # shows default recommended streams for non-logged in users based on highest viewers
    streams = default_recommendations()
    for stream in streams:
        stream['tags'] = stream_tags(stream["stream_id"])

    return jsonify(streams)

@login_required 
@stream_bp.route('/get_recommended_streams')
def get_recommended_streams() -> list[dict]:
    """
    Queries DB to get a list of recommended streams using an algorithm
    """

    user_id = session.get("username")
    category = user_recommendation_category(user_id)
    streams = recommendations_based_on_category(category)
    for stream in streams:
        stream['tags'] = stream_tags(stream["stream_id"])
    return jsonify(streams)

@stream_bp.route('/get_categories')
def get_categories() -> list[dict]:
    """
    Returns a list of top 5 most popular categories
    """

    category_data = category_recommendations()
    return jsonify(category_data)

@login_required 
@stream_bp.route('/get_recommended_categories')
def get_recommended_categories() -> list | list[dict]:
    """
    Queries DB to get a list of recommended categories for the user

    """
    user_id = session.get("user_id")
    categories = user_category_recommendations(user_id)
    return categories


@stream_bp.route('/get_streamer_data/<string:streamer_username>')
def get_streamer_data(streamer_username):
    """
    Returns a given streamer's data
    """
    streamer_id = get_user_id(streamer_username)
    if not streamer_id:
        abort(404)
    data = streamer_data(streamer_id)
    return data


@stream_bp.route('/streamer/<string:streamer_username>/status')
def get_streamer_status(streamer_username):
    """
    Returns a streamer's status, if they are live or not and their most recent stream
    """
    user_id = get_user_id(streamer_username)

    if not user_id:
        abort(404)

    is_live = streamer_live_status(user_id)
    most_recent_stream = streamer_most_recent_stream(user_id)

    if not most_recent_stream:
        most_recent_stream = {'stream_id': None}

    return jsonify({
        "is_live": is_live,
        "most_recent_stream": most_recent_stream['stream_id']
    })
    

@stream_bp.route('/get_stream_data/<string:streamer_username>')
def get_stream(streamer_username):
    """
    Returns a streamer's most recent stream data
    """
    user_id = get_user_id(streamer_username)
    if not user_id:
        abort(404)
    
    return jsonify(streamer_most_recent_stream(user_id))

@login_required
@stream_bp.route('/get_followed_category_streams')
def get_following_categories_streams():
    """
    Returns popular streams in categories which the user followed
    """

    streams = followed_categories_recommendations(get_user_id(session.get('username')))

    for stream in streams:
        stream['tags'] = stream_tags(stream["stream_id"])
    return jsonify(streams)


@stream_bp.route('/get_stream_data/<string:streamer_username>/<int:stream_id>')
def get_specific_stream(streamer_username, stream_id):
    """
    Returns a streamer's stream data given stream_id
    """
    user_id = get_user_id(streamer_username)
    stream = user_stream(user_id, stream_id)
    if stream:
        return jsonify(stream)

    return jsonify({'error': 'Stream not found'}), 404

@login_required
@stream_bp.route('/get_followed_streamers')
def get_followed_streamers():
    """
    Queries DB to get a list of followed streamers
    """
    username = session.get('username')
    user_id = get_user_id(username)

    live_following_streams = followed_streamers(user_id)
    return live_following_streams

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
    user_info = db.fetchone("""SELECT user_id FROM users WHERE stream_key = ?""", (request.form.get("name"),))

    if not user_info:
        return "Unauthorized", 403
    
    # Set stream to not live
    db.execute("""UPDATE streams SET isLive = 0 WHERE user_id = ? AND isLive = 1""", (user_info["user_id"],))

    return "Stream ended", 200