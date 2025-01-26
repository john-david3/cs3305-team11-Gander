from database.database import Database
from typing import Optional

def streamer_data(streamer_id: int):
    """
    Retrieves data given streamer (username, since, isPartnered)
    """
    db = Database()
    cursor = db.create_connection()
    streamer_data = cursor.execute("""SELECT username, since, isPartnered FROM 
                                   streamers JOIN users ON
                                   streamers.user_id = users.user_id
                                   WHERE streamer_id = ?""", (streamer_id,)).fetchone()
    return streamer_data

def streamer_live_status(streamer_id: int) -> bool:
    """
    Returns whether the given streamer is live
    """
    db = Database()
    cursor = db.create_connection()
    return bool(cursor.execute("SELECT 1 FROM streams WHERE streamer_id = ? AND isLive = 1 ORDER BY stream_id DESC", (streamer_id,)).fetchone())

def followed_live_streams(user_id: int):
    """
    Searches for streamers who the user followed which are currently live
    """
    db = Database()
    cursor = db.create_connection()

    live_streams = cursor.execute("""
        SELECT streamer_id, stream_id, title, num_viewers
        FROM streams 
        WHERE streamer_id IN (SELECT streamer_id FROM follows WHERE user_id = ?)
        AND stream_id = (SELECT MAX(stream_id) FROM streams WHERE streamer_id = streams.streamer_id)
        AND isLive = 1
    """, (user_id,)).fetchall()

    return live_streams

def streamer_name(streamer_id: int) -> Optional[str]:
    """
    Returns streamers username given streamer_id
    """
    db = Database()
    cursor = db.create_connection()

    streamer_username = cursor.execute(
        "SELECT username FROM users WHERE user_id = (SELECT user_id FROM streamers WHERE streamer_id = ?)", (streamer_id,)).fetchone()
    return streamer_username[0] if streamer_username else None

def streamer_id(streamer_name: str) -> Optional[int]:
    """
    Returns streamers id given streamers name
    """
    db = Database()
    cursor = db.create_connection()

    streamer_id = cursor.execute(
        "SELECT streamer_id FROM streamers WHERE user_id = (SELECT user_id FROM users WHERE username = ?)",(streamer_name,)).fetchone()
    return streamer_id[0] if streamer_id else None

def streamer_most_recent_stream(streamer_id: int):
    """
    Returns data of the most recent stream by a streamer
    """
    db = Database()
    cursor = db.create_connection()

    most_recent_stream = cursor.execute("""SELECT * FROM streams WHERE 
                                        streamer_id = ? AND 
                                        stream_id = (SELECT MAX(stream_id) FROM
                                        streams WHERE streamer_id = ?)""", (streamer_id,streamer_id)).fetchone()
    return most_recent_stream

def streamer_stream(streamer_id: int, stream_id: int):
    """
    Returns data of a streamers selected stream
    """
    db = Database()
    cursor = db.create_connection()
    
    stream = cursor.execute("SELECT * FROM streams WHERE streamer_id = ? AND stream_id = ?", (streamer_id,stream_id)).fetchone()

    return stream
