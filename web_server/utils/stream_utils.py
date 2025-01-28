from database.database import Database
from typing import Optional


def streamer_live_status(user_id: int) -> bool:
    """
    Returns whether the given streamer is live
    """
    db = Database()
    cursor = db.create_connection()
    return bool(cursor.execute("SELECT 1 FROM streams WHERE user_id = ? AND isLive = 1 ORDER BY stream_id DESC", (user_id,)).fetchone())

def followed_live_streams(user_id: int):
    """
    Searches for streamers who the user followed which are currently live
    """
    db = Database()
    cursor = db.create_connection()

    live_streams = cursor.execute("""
        SELECT user_id, stream_id, title, num_viewers
        FROM streams 
        WHERE user_id IN (SELECT followed_id FROM follows WHERE user_id = ?)
        AND stream_id = (SELECT MAX(stream_id) FROM streams WHERE user_id = streams.user_id)
        AND isLive = 1;
    """, (user_id,)).fetchall()

    return live_streams

def streamer_most_recent_stream(user_id: int):
    """
    Returns data of the most recent stream by a streamer
    """
    db = Database()
    cursor = db.create_connection()

    most_recent_stream = cursor.execute("""SELECT * FROM streams WHERE 
                                        user_id = ? AND 
                                        stream_id = (SELECT MAX(stream_id) FROM
                                        streams WHERE user_id = ?)""", (user_id, user_id)).fetchone()
    return most_recent_stream

def user_stream(user_id: int, stream_id: int):
    """
    Returns data of a streamers selected stream
    """
    db = Database()
    cursor = db.create_connection()
    
    stream = cursor.execute("SELECT * FROM streams WHERE user_id = ? AND stream_id = ?", (user_id,stream_id)).fetchone()

    return stream
