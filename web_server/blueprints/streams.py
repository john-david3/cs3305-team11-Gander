from flask import Blueprint

stream_bp = Blueprint("stream", __name__)


@stream_bp.route('/get_streams', methods=['GET'])
def get_sample_streams():
    """
    Returns a list of (sample) streams live right now
    """

    # top 25, if not logged in
    # if logged in, show streams that match user's tags
    # user attains tags from the tags of the streamers they follow, and streamers they've watched

    # TODO Add a category field to the stream object
    streams = [
        {
            "id": 1,
            "title": "Gaming Stream",
            "streamer": "Gamer123",
            "viewers": 1500,
            "thumbnail": "dance_game.png",
        },
        {
            "id": 2,
            "title": "Art Stream",
            "streamer": "Artist456",
            "viewers": 800,
            "thumbnail": "surface.jpeg",
        },
        {
            "id": 3,
            "title": "Music Stream",
            "streamer": "Musician789",
            "viewers": 2000,
            "thumbnail": "monkey.png",
        },
        {
            "id": 4,
            "title": "Just Chatting",
            "streamer": "Chatty101",
            "viewers": 1200,
            "thumbnail": "chatting_category.jpg",
        },
        {
            "id": 5,
            "title": "Cooking Stream",
            "streamer": "Chef202",
            "viewers": 1000,
            "thumbnail": "cooking_category.jpg",
        }
    ]
    return streams


@stream_bp.route('/get_recommended_streams', methods=['GET'])
def get_recommended_streams():
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


@stream_bp.route('/get_categories', methods=['GET'])
def get_categories():
    """
    Returns a list of (sample) categories being watched right now
    """
    return [
        {
            "id": 1,
            "title": "Gaming",
            "viewers": 220058,
            "thumbnail": "gaming_category.jpg",
        },
        {
            "id": 2,
            "title": "Music",
            "viewers": 150060,
            "thumbnail": "music_category.webp",
        },
        {
            "id": 3,
            "title": "Art",
            "viewers": 10200,
            "thumbnail": "art_category.jpg",
        },
        {
            "id": 4,
            "title": "Cooking",
            "viewers": 8000,
            "thumbnail": "cooking_category.jpg",
        },
        {
            "id": 5,
            "title": "Just Chatting",
            "viewers": 83900,
            "thumbnail": "chatting_category.jpg",
        }
    ]


@stream_bp.route('/get_followed_categories', methods=['GET'])
def get_followed_categories():
    """
    Queries DB to get a list of followed categories
    """
    categories = []
    if categories:
        return categories
    return get_categories()


@stream_bp.route('/get_streamer_data/<int:streamer_id>', methods=['GET'])
def get_streamer(streamer_id):
    """
    Returns a streamer's data
    """
    return

@stream_bp.route('/streamer/<string:streamerName>/status')
def get_streamer_status(streamerName):
    """
    Returns a streamer's status, if they are live or not
    """
    return {"status": "live", "streamId": 1}


@stream_bp.route('/get_stream_data/<int:stream_id>', methods=['GET'])
def get_stream(stream_id):
    """
    Returns a streamer's stream data
    """
    return


@stream_bp.route('/get_followed_streams', methods=['GET'])
def get_followed_streamers():
    """
    Queries DB to get a list of followed streamers
    """
    return


@stream_bp.route('/save_stream_thumbnail/<int:streamer_id>', methods=['POST'])
def stream_thumbnail_snapshot(streamer_id):
    """
    Function to be called periodically which saves the current live stream as an img to be used for the thumbnail to be displayed
    """
    return
