from database.database import Database
import os, subprocess

def get_streamer_live_status(user_id: int):
    """
    Returns boolean on whether the given streamer is live
    """
    with Database() as db:
        is_live = db.fetchone("""
            SELECT is_live 
            FROM users 
            WHERE user_id = ?;
        """, (user_id,))

    return is_live


def generate_thumbnail(user_id: int) -> None:
    """
    Generates the thumbnail of a stream
    """
    with Database() as db:
        username = db.fetchone("""SELECT * FROM users WHERE user_id = ?""", (user_id,))

    if not username:
        return None
    
    if not os.path.exists(f"stream_data/thumbnails/"):
        os.makedirs(f"stream_data/thumbnails/")
    
    thumbnail_command = [
        "ffmpeg",
        "-y",
        "-i",
        f"stream_data/hls/{username['username']}/index.m3u8",
        "-vframes",
        "1",
        "-q:v",
        "2",
        f"stream_data/thumbnails/{username['username']}.jpg"
    ]

    subprocess.run(thumbnail_command)

