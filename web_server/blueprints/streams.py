from flask import Blueprint, session
from utils.stream_utils import streamer_data, streamer_id, streamer_live_status, streamer_most_recent_stream, streamer_stream, followed_live_streams
from utils.user_utils import get_user_id
from database.database import Database 
stream_bp = Blueprint("stream", __name__)


@stream_bp.route('/get_streams')
def get_sample_streams() -> list[dict]:
    """
    Returns a list of (sample) streams live right now
    """

    # top 25, if not logged in
    # if logged in, show streams that match user's tags
    # user attains tags from the tags of the streamers they follow, and streamers they've watched

    # TODO Add a category field to the stream object
    db = Database()
    cursor = db.create_connection()

    # fetch top 25 most viewed live streams if not logged in
    # TODO Add a check to see if user is logged in, if they are, find streams that match categories they follow
    streams = cursor.execute("""SELECT * FROM streams 
                             ORDER BY num_viewers DESC
                             LIMIT 25; """).fetchall()
    return streams


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
    cursor = db.create_connection()

    # fetch top categories by number of viewers
    categories = cursor.execute("""SELECT category_name, SUM(num_viewers) FROM categories, streams
                                WHERE categories.category_id = streams.category_id
                                GROUP BY category_name
                                ORDER BY SUM(num_viewers) DESC
                                LIMIT 25; """).fetchall()
    return categories



@stream_bp.route('/get_followed_categories')
def get_followed_categories() -> list | list[dict]:
    """
    Queries DB to get a list of followed categories
    Hmm..
    """
    categories = []
    if categories:
        return categories
    return get_categories()


@stream_bp.route('/get_streamer_data/<int:streamer_username>')
def get_streamer_data(streamer_username):
    """
    Returns a given streamer's data
    """
    streamers_id = streamer_id(streamer_username)
    if not streamers_id:
        return #whatever
    streamers_data = streamer_data(streamers_id)
    return streamers_data

@stream_bp.route('/streamer/<string:streamer_username>/status')
def get_streamer_status(streamer_username):
    """
    Returns a streamer's status, if they are live or not and their most recent stream
    """
    return {"status": "live", "streamId": 1}
    streamers_id = streamer_id(streamer_username)
    if not streamers_id:
        return #whatever
    streamer_status = streamer_live_status(streamers_id)
    stream_id = streamer_most_recent_stream(streamers_id)
    return {"live": streamer_status, "streamerId": streamers_id, "streamId": stream_id}


@stream_bp.route('/get_stream_data/<int:streamer_username>', methods=['GET'])
def get_stream(streamer_username):
    """
    Returns a streamer's most recent stream data
    """
    streamers_id = streamer_id(streamer_username)
    if not streamers_id:
        return #whatever
    most_recent_stream = streamer_most_recent_stream(streamers_id)
    if most_recent_stream:
        return most_recent_stream
    
    return #Whatever

@stream_bp.route('/get_stream_data/<int:streamer_username>/<int:stream_id>', methods=['GET'])
def get_specific_stream(streamer_username,stream_id):
    """
    Returns a streamer's stream data given stream_id
    """
    stream = streamer_stream(streamer_username, stream_id)
    if stream:
        return stream
    
    return #whatever

#@login_required
# need to add in a lock to this route for only logged in users since we will be taking from the session
@stream_bp.route('/get_followed_streams', methods=['GET'])
def get_followed_streamers():
    """
    Queries DB to get a list of followed streamers
    """
    username = session.get('username')
    user_id = get_user_id(username)
    live_following_streams = followed_live_streams(user_id)
    if not followed_live_streams:
        return #whatever
    return live_following_streams


@stream_bp.route('/save_stream_thumbnail/<int:streamer_id>', methods=['POST'])
def stream_thumbnail_snapshot(streamer_id):
    """
    Function to be called periodically which saves the current live stream as an img to be used for the thumbnail to be displayed
    will be asking streamer guy how to get the picture
    will be saved as a png stream_id.streamer_id.png or similar to create a unique image
    """
    return
