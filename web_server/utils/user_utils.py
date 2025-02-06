from database.database import Database
from typing import Optional, List
from datetime import datetime
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from os import getenv
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
load_dotenv()

serializer = URLSafeTimedSerializer(getenv("AUTH_SECRET_KEY"))

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
            FROM user 
            WHERE user_id = ?
        """, (user_id,))
    return data['username'] if data else None

def get_session_info_email(email: str) -> dict:
    """
    Returns username and user_id given email
    """
    with Database as db:
        session_info = db.fetchone("""
            SELECT user_id, username
            FROM user
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

def follow(user_id: int, following_id: int):
    """
    Follows following_id user from user_id user
    """
    with Database() as db:
        data = db.execute("""
            SELECT * FROM follows
            WHERE user_id = ?
            AND followed_id = ?                            
        """, (user_id, following_id))
        
        if not data:
            db.execute("""
            INSERT INTO follows (user_id, followed_id)
            VALUES(?,?)
        """, (user_id, following_id))

def unfollow(user_id: int, followed_id: int):
    """
    Unfollows follow_id user from user_id user
    """
    with Database() as db:
        db.execute("""
            DELETE FROM follows
            WHERE user_id = ?
            AND followed_id = ?
        """, (user_id, followed_id))


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
        remaining_time = (expiration_date - datetime.now()).seconds
        return remaining_time

    return 0

def generate_token(email, salt_value) -> str:
    """
    Creates a token for password reset
    """
    token = serializer.dumps(email, salt=salt_value)
    return token

def verify_token(token: str, salt_value) -> Optional[str]:
    """
    Given a token, verifies and decodes it into an email
    """
    
    try:
        email = serializer.loads(token, salt=salt_value, max_age=3600)
        return email
    except SignatureExpired:
        # Token expired
        print("Token has expired", flush=True)
        return None
    except BadSignature:
        # Invalid token
        print("Token is invalid", flush=True)
        return None

def reset_password(new_password: str, email: str) -> bool:
    """
    Given email and new password reset the password for a given user
    """
    with Database() as db:
        db.execute("""
            UPDATE users 
            SET password = ? 
            WHERE email = ?
        """, (generate_password_hash(new_password), email))
    
    return True

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

def get_user_data(user_id: int) -> Optional[dict]:
    """
    Returns username, bio, number of followers, and if user is partnered from user_id
    """
    with Database() as db:
        data = db.fetchone("""
            SELECT username, bio, num_followers, is_partnered FROM users
            WHERE user_id = ?;
        """, (user_id,))
    return data