from database.database import Database
from typing import Optional
from datetime import datetime

def get_user_id(username: str) -> Optional[int]:
    """
    Returns user_id associated with given username
    """
    db = Database()
    cursor = db.create_connection()
    data = cursor.execute("SELECT user_id FROM user WHERE username = ?", (username,)).fetchone()
    return data[0] if data else None

def get_username(user_id: str) -> Optional[str]:
    """
    Returns username associated with given user_id
    """
    db = Database()
    cursor = db.create_connection()
    data = cursor.execute("SELECT username FROM user WHERE username = ?", (user_id,)).fetchone()
    return data[0] if data else None

def is_subscribed(user_id: int, streamer_id: int) -> bool:
    """
    Returns True if user is subscribed to a streamer else False
    """
    db = Database()
    cursor = db.create_connection()
    return bool(cursor.execute(
        "SELECT 1 FROM subscribes WHERE user_id = ? AND streamer_id = ? AND expires > since", 
        (user_id, streamer_id)
    ).fetchone())

def is_following(user_id: int, streamer_id:int) -> bool:
    db = Database()
    cursor = db.create_connection()
    return bool(cursor.execute(
        "SELECT 1 FROM follows WHERE user_id = ? AND streamer_id = ?", 
        (user_id, streamer_id)
    ).fetchone())

def subscription_expiration(user_id: int, streamer_id: int) -> int:
    """
    Returns the amount of time left until user subscription to a streamer ends
    """
    db = Database()
    cursor = db.create_connection()
    data = cursor.execute(
        "SELECT expires from subscriptions WHERE user_id = ? AND streamer_id = ? AND expires > since", (user_id,streamer_id)).fetchone()
    remaining_time = 0
    if data:
        expiration_date = data[0]

        remaining_time = (expiration_date - datetime.now()).seconds
    return remaining_time
