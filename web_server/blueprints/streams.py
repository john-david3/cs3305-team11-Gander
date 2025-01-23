from flask import Blueprint

stream_bp = Blueprint("stream", __name__)

@stream_bp.route('/get_streams', methods=['GET'])
def get_sample_streams():
    """
    Returns a list of (sample) streamers live right now
    """

    # top 25, if not logged in
    # if logged in, show streams that match user's tags
        # user attains tags from the tags of the streamers they follow, and streamers they've watched

    streamers = [
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
      "thumbnail": "elf.webp",
    },
    {
      "id": 5,
      "title": "Cooking Stream",
      "streamer": "Chef202",
      "viewers": 1000,
      "thumbnail": "art.jpg",
    }
  ]
    return streamers


@stream_bp.route('/get_recommended_streams', methods=['GET'])
def get_recommended_streamers():
    """
    Queries DB to get a list of recommended streamers using an algorithm
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