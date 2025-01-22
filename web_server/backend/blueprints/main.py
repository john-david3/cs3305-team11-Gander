from flask import render_template, Blueprint

main_bp = Blueprint("app", __name__)


@main_bp.route('/get_loggedin_status')
def get_loggedin_status():
    logged_in = False
    """
    Returns whether the user is logged in or not
    """
    return {"logged_in": logged_in}


@main_bp.route('/get_streams')
def get_sample_streams():
    """
    Returns a list of (sample) streamers live right now
    """
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