from flask import render_template, Blueprint

main_bp = Blueprint("app", __name__)


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
      "thumbnail": "assets/images/monkey.png",
    },
    {
      "id": 2,
      "title": "Art Stream",
      "streamer": "Artist456",
      "viewers": 800,
      "thumbnail": "assets/images/surface.jpeg",
    },
    {
      "id": 3,
      "title": "Music Stream",
      "streamer": "Musician789",
      "viewers": 2000,
      "thumbnail": "assets/images/dance_game.png",
    },
    {
      "id": 4,
      "title": "Just Chatting",
      "streamer": "Chatty101",
      "viewers": 1200,
      "thumbnail": "assets/images/elf.webp",
    },
  ]
    return streamers

