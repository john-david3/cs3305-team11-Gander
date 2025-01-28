from flask import Blueprint, session, jsonify, g
from utils.stream_utils import streamer_live_status, streamer_most_recent_stream, user_stream, followed_live_streams, followed_streamers
from utils.user_utils import get_user_id
from blueprints.utils import login_required
from database.database import Database
stream_bp = Blueprint("stream", __name__)


@stream_bp.route('/get_streams')
def get_sample_streams() -> list[dict]:
    """
    Returns a list of (sample) streams live right now
    """
    # TODO Add a check to see if user is logged in, if they are, find streams that match categories they follow
    db = Database()
    db.create_connection()
    streams = db.fetchall("""SELECT * FROM streams 
                            ORDER BY num_viewers DESC
                            LIMIT 25; """)
    return jsonify({
        "streams": streams
    })


@stream_bp.route('/get_recommended_streams')
def get_recommended_streams() -> list[dict]:
    """
    Queries DB to get a list of recommended streams using an algorithm
    """
    return [
        {
            "id": 1,
            "title": "Fake Game Showcase w/ Devs",
            "streamer": "Gamer_boy9000",
            "viewers": 15458,
            "thumbnail": "game1.jpg",
        }, {
            "id": 2,
            "title": "Game OSTs I like!",
            "streamer": "GéMusicLover",
            "viewers": 52911,
            "thumbnail": "game_music1.jpg",
        },
        {
            "id": 3,
            "title": "Chill Stream - Cooking with Chef Ramsay",
            "streamer": "HarrietDgoat",
            "viewers": 120283,
            # Intentionally left out thumbnail to showcase placeholder image
        }]


@stream_bp.route('/get_categories')
def get_categories() -> list[dict]:
    """
    Returns a list of (sample) categories being watched right now
    """

    db = Database()
    db.create_connection()
    categories = db.fetchall("""SELECT categories.category_id, category_name, SUM(num_viewers) as num_viewers FROM categories, streams
                                WHERE categories.category_id = streams.category_id
                                GROUP BY category_name
                                ORDER BY SUM(num_viewers) DESC
                                LIMIT 25; """)
    
    return jsonify({'categories': categories})

@login_required
@stream_bp.route('/get_recommended_categories')
def get_recommended_categories() -> list | list[dict]:
    """
    Queries DB to get a list of recommended categories for the user

    """
    username = session.get('username')
    user_id = get_user_id(username)

    db = Database()
    db.create_connection()
    categories = db.fetchall("""SELECT categories.category_id, categories.category_name, favourability
                                FROM categories, user_preferences
                                WHERE user_id = ? AND categories.category_id = user_preferences.category_id,
                                ORDER BY favourability DESC""", (user_id,))

    return jsonify({'categories': categories})


@stream_bp.route('/get_streamer_data/<int:streamer_username>')
def get_streamer_data(streamer_username):
    """
    Returns a given streamer's data
    """
    return


@stream_bp.route('/streamer/<string:streamer_username>/status')
def get_streamer_status(streamer_username):
    """
    Returns a streamer's status, if they are live or not and their most recent stream
    """
    user_id = get_user_id(streamer_username)

    if not user_id:
        return jsonify({
            "error": "User not found"
        })
    
    is_live = streamer_live_status(user_id)
    most_recent_stream = streamer_most_recent_stream(user_id)

    if not most_recent_stream:
        most_recent_stream = {'stream_id': None}

    return jsonify({
        "is_live": is_live,
        "most_recent_stream": most_recent_stream['stream_id']
    })
    

@stream_bp.route('/get_stream_data/<string:streamer_username>', methods=['GET'])
def get_stream(streamer_username):
    """
    Returns a streamer's most recent stream data
    """
    user_id = get_user_id(streamer_username)
    if not user_id:
        return jsonify({
            "error": "User not found"
        })
    
    return jsonify(streamer_most_recent_stream(user_id))


@stream_bp.route('/get_stream_data/<string:streamer_username>/<int:stream_id>', methods=['GET'])
def get_specific_stream(streamer_username, stream_id):
    """
    Returns a streamer's stream data given stream_id
    """
    user_id = get_user_id(streamer_username)
    stream = user_stream(user_id, stream_id)
    if stream:
        return jsonify(stream)

    return jsonify({
        "error": "Stream not found"
    })

# @login_required

@login_required
@stream_bp.route('/get_followed_streamers', methods=['GET'])
def get_followed_streamers():
    """
    Queries DB to get a list of followed streamers
    """
    username = session.get('username')
    user_id = get_user_id(username)

    live_following_streams = followed_streamers(user_id)
    return live_following_streams


@stream_bp.route('/save_stream_thumbnail/<int:streamer_id>', methods=['POST'])
def stream_thumbnail_snapshot(streamer_id):
    """
    Function to be called periodically which saves the current live stream as an img to be used for the thumbnail to be displayed
    will be asking streamer guy how to get the picture 
        will also be asking myself how to do this - Dylan
    will be saved as a png stream_id.streamer_id.png or similar to create a unique image
    """
    return
