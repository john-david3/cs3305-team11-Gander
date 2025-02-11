from database.database import Database
from typing import Optional, List
from datetime import datetime, timedelta
from dateutil import parser

def get_user_id(username: str) -> Optional[int]:
    """
    Returns user_id associated with given username
    """
    with Database() as db:
        data = db.fetchone("""
            SELECT user_id 
            FROM users 
            WHERE username = ?
        """, (username,))
    return data['user_id'] if data else None

def get_username(user_id: str) -> Optional[str]:
    """
    Returns username associated with given user_id
    """
    with Database() as db:
        data = db.fetchone("""
            SELECT username 
            FROM users
            WHERE user_id = ?
        """, (user_id,))
    return data['username'] if data else None

def get_session_info_email(email: str) -> dict:
    """
    Returns username and user_id given email
    """
    with Database() as db:
        session_info = db.fetchone("""
            SELECT user_id, username
            FROM users
            WHERE email = ?
        """, (email,))
        return session_info
    
def is_user_partner(user_id: int) -> bool:
    """
    Returns True if user is a partner, else False
    """
    with Database() as db:
        data = db.fetchone("""
            SELECT is_partnered 
            FROM users 
            WHERE user_id = ?
        """, (user_id,))
    return bool(data)

def is_subscribed(user_id: int, subscribed_to_id: int) -> bool:
    """
    Returns True if user is subscribed to a streamer, else False
    """
    with Database() as db:
        result = db.fetchone("""
            SELECT *
            FROM subscribes 
            WHERE user_id = ? 
            AND subscribed_id = ?
            AND expires > ?;
        """, (user_id, subscribed_to_id, datetime.now()))
    print(result)
    if result:
        return True
    return False

def is_following(user_id: int, followed_id: int) -> bool:
    """
    Returns where a user is following another
    """
    with Database() as db:
        result = db.fetchone("""
            SELECT 1 
            FROM follows 
            WHERE user_id = ? 
            AND followed_id = ?
        """, (user_id, followed_id))
    return bool(result)

def follow(user_id: int, followed_id: int):
    """
    Follows followed_id user from user_id user
    """
    if is_following(user_id, followed_id):
        return {"success": False, "error": "Already following user"}, 400
    
    with Database() as db:
        db.execute("""
        INSERT INTO follows (user_id, followed_id)
        VALUES(?,?);
    """, (user_id, followed_id))
    return {"success": True}

def unfollow(user_id: int, followed_id: int):
    """
    Unfollows followed_id user from user_id user
    """
    if not is_following(user_id, followed_id):
        return {"success": False, "error": "Not following user"}, 400
    with Database() as db:
        db.execute("""
            DELETE FROM follows
            WHERE user_id = ?
            AND followed_id = ?
        """, (user_id, followed_id))
    return {"success": True}

def subscribe(user_id: int, streamer_id: int):
    """
    Subscribes user_id to streamer_id
    """
    # If user is already subscribed then extend the expiration date else create a new entry
    with Database() as db:
        existing = db.fetchone("""
            SELECT expires 
            FROM subscribes 
            WHERE user_id = ? AND subscribed_id = ?
        """, (user_id, streamer_id))
        if existing:
            db.execute("""
                UPDATE subscribes SET expires = expires + ?
                WHERE user_id = ? AND subscribed_id = ?
            """, (timedelta(days=30), user_id, streamer_id))
        else:   
            db.execute("""
                INSERT INTO subscribes
                (user_id, subscribed_id, since, expires)
                VALUES (?,?,?,?)
            """, (user_id, streamer_id, datetime.now(), datetime.now() + timedelta(days=30)))

def delete_subscription(user_id: int, subscribed_id: int):
    """
    Deletes a subscription entry given user_id and streamer_id
    """
    with Database() as db:
        db.execute("""
            DELETE FROM subscribes
            WHERE user_id = ? AND subscribed_id = ?
        """, (user_id, subscribed_id))


def subscription_expiration(user_id: int, subscribed_id: int) -> int:
    """
    Returns the amount of time left until user subscription to a streamer ends
    """
    with Database() as db:
        data = db.fetchone("""
            SELECT expires 
            FROM subscribes 
            WHERE user_id = ? 
            AND subscribed_id = ? 
            AND expires > ?
        """, (user_id, subscribed_id, datetime.now()))

    if data:
        expiration_date = data["expires"]
        remaining_time = (parser.parse(expiration_date) - datetime.now()).seconds
        return remaining_time

    return 0

def get_email(user_id: int) -> Optional[str]:
    with Database() as db:
        email = db.fetchone("""
            SELECT email
            FROM users
            WHERE user_id = ?
        """, (user_id,))
    
    return email["email"] if email else None

def get_followed_streamers(user_id: int) -> Optional[List[dict]]:
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

def get_user(user_id: int) -> Optional[dict]:
    """
    Returns information about a user from user_id
    """
    with Database() as db:
        data = db.fetchone("""
            SELECT user_id, username, bio, num_followers, is_partnered, is_live FROM users
            WHERE user_id = ?;
        """, (user_id,))
    return data