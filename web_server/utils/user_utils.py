from database.database import Database
from typing import Optional
from datetime import datetime
from itsdangerous import URLSafeTimedSerializer
from os import getenv
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
load_dotenv()

serializer = URLSafeTimedSerializer(getenv("AUTH_SECRET_KEY"))

def get_user_id(username: str) -> int:
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

def is_subscribed(user_id: int, streamer_id: int) -> bool:
    """
    Returns True if user is subscribed to a streamer, else False
    """
    with Database() as db:
        result = db.fetchone("""
            SELECT 1 
            FROM subscribes 
            WHERE user_id = ? 
            AND streamer_id = ? 
            AND expires > ?
        """, (user_id, streamer_id, datetime.now()))
    return bool(result)

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

def subscription_expiration(user_id: int, subscribed_id: int) -> int:
    """
    Returns the amount of time left until user subscription to a streamer ends
    """
    with Database() as db:
        data = db.fetchone("""
            SELECT expires 
            FROM subscriptions 
            WHERE user_id = ? 
            AND subscribed_id = ? 
            AND expires > ?
        """, (user_id, subscribed_id, datetime.now()))

    if data:
        expiration_date = data["expires"]
        remaining_time = (expiration_date - datetime.now()).seconds
        return remaining_time

    return 0

def verify_token(token: str):
    """
    Given a token verifies token and decodes the token into an email
    """
    email = serializer.loads(token, salt='1', max_age=3600)
    return email if email else False

def reset_password(new_password: str, email: str):
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