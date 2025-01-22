from flask import Blueprint

main_bp = Blueprint("app", __name__)

## temp, showcasing HLS
@main_bp.route('/hls1/<stream_id>')
def hls(stream_id):
    stream_url = f"http://127.0.0.1:8080/hls/{stream_id}/index.m3u8"
    return render_template("video.html", video_url=stream_url)
#--------------------------------------------------------


@main_bp.route('/get_loggedin_status')
def get_loggedin_status():
    logged_in = False
    """
    Returns whether the user is logged in or not
    """
    return {"logged_in": logged_in}

@main_bp.route('/authenticate_user')
def authenticate_user():
    """
    Authenticates the user
    """
    return {"authenticated": True}


@main_bp.route('/get_streams')
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

#TODO Route for saving uploaded thumbnails to database, serving these images to the frontend upon request: →→→ @main_bp.route('/images/<path:filename>') \n def serve_image(filename): ←←←