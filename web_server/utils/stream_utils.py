from database.database import Database
from typing import Optional
import sqlite3, os, subprocess
from time import sleep
from typing import Optional, List

def streamer_live_status(user_id: int) -> dict:
    """
    Returns boolean on whether the given streamer is live
    """
    with Database() as db:
        is_live = db.fetchone("""
            SELECT isLive 
            FROM streams 
            WHERE user_id = ?
            ORDER BY stream_id DESC
            LIMIT 1;
        """, (user_id,))

    return is_live

def followed_live_streams(user_id: int) -> Optional[List[dict]]:
    """
    Searches for streamers who the user followed which are currently live
    """
    with Database() as db:
        live_streams = db.fetchall("""
            SELECT user_id, stream_id, title, num_viewers
            FROM streams 
            WHERE user_id IN (SELECT followed_id FROM follows WHERE user_id = ?)
            AND stream_id = (SELECT MAX(stream_id) FROM streams WHERE user_id = streams.user_id)
            AND isLive = 1;
        """, (user_id,))
    return live_streams

def followed_streamers(user_id: int) -> Optional[List[dict]]:
    """
    Returns a list of streamers who the user follows
    """
    with Database() as db:
        followed_streamers = db.fetchall("""
            SELECT user_id, username
            FROM users
            WHERE user_id IN (SELECT followed_id FROM follows WHERE user_id = ?);
        """, (user_id,))
    return followed_streamers

def streamer_most_recent_stream(user_id: int) -> dict:
    """
    Returns data of the most recent stream by a streamer
    """
    with Database() as db:
        most_recent_stream = db.fetchone("""
            SELECT * FROM streams 
            WHERE user_id = ? 
            AND stream_id = (SELECT MAX(stream_id) FROM streams WHERE user_id = ?)
        """, (user_id, user_id))
    return most_recent_stream

def user_stream(user_id: int, stream_id: int) -> dict:
    """
    Returns data of a streamers selected stream
    """
    with Database() as db:
        stream = db.fetchone("""
            SELECT * FROM streams 
            WHERE user_id = ? 
            AND stream_id = ?
        """, (user_id, stream_id))
    return stream

def generate_thumbnail(user_id: int) -> None:
    """
    Returns the thumbnail of a stream
    """
    db = Database()
    username = db.fetchone("""SELECT * FROM users WHERE user_id = ?""", (user_id,))
    db.close_connection()

    if not username:
        return None
    
    if not os.path.exists(f"stream_data/thumbnails/"):
        os.makedirs(f"stream_data/thumbnails/")

    subprocess.Popen(["ls", "-lR"])
    
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
def stream_tags(stream_id: int) -> Optional[List[str]]:
    """
    Given a stream return tags associated with the stream
    """
    with Database() as db:
        tags = db.fetchall("""
            SELECT tag_name 
            FROM tags
            JOIN stream_tags ON tags.tag_id = stream_tags.tag_id
            WHERE stream_id = ?       
        """, (stream_id,))
        tags = [tag['tag_name'] for tag in tags] if tags else None
    return tags
