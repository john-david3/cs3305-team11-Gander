from database.database import Database
from typing import Optional
from datetime import datetime
from itsdangerous import URLSafeTimedSerializer
from os import getenv
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
load_dotenv()

serializer = URLSafeTimedSerializer(getenv("AUTH_SECRET_KEY"))

def get_user_id(username: str) -> Optional[int]:
    """
    Returns user_id associated with given username
    """
    db = Database()
    db.create_connection()

    try:
        data = db.fetchone(
            "SELECT user_id FROM users WHERE username = ?", 
            (username,)
        )
        return data[0] if data else None
    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        db.close_connection()

def get_username(user_id: str) -> Optional[str]:
    """
    Returns username associated with given user_id
    """
    db = Database()
    db.create_connection()

    try:
        data = db.fetchone(
            "SELECT username FROM user WHERE user_id = ?", 
            (user_id,)
        )
        return data[0] if data else None
    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        db.close_connection()
    
def is_user_partner(user_id: int) -> bool:
    """
    Returns True if user is a partner, else False
    """
    db = Database()
    db.create_connection()

    try:
        data = db.fetchone(
            "SELECT is_partnered FROM users WHERE user_id = ?", 
            (user_id,)
        )
        return bool(data)
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        db.close_connection()

def is_subscribed(user_id: int, streamer_id: int) -> bool:
    """
    Returns True if user is subscribed to a streamer, else False
    """
    db = Database()
    db.create_connection()

    try:
        result = db.fetchone(
            "SELECT 1 FROM subscribes WHERE user_id = ? AND streamer_id = ? AND expires > ?", 
            (user_id, streamer_id, datetime.now())
        )
        return bool(result)
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        db.close_connection()

def is_following(user_id: int, followed_id: int) -> bool:
    db = Database()
    db.create_connection()
    
    try:
        result = db.fetchone(
            "SELECT 1 FROM follows WHERE user_id = ? AND followed_id = ?", 
            (user_id, followed_id)
        )
        return bool(result)
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        db.close_connection()

def subscription_expiration(user_id: int, subscribed_id: int) -> int:
    """
    Returns the amount of time left until user subscription to a streamer ends
    """
    db = Database()
    db.create_connection()
    remaining_time = 0
    try:
        data = db.fetchone(
            "SELECT expires from subscriptions WHERE user_id = ? AND subscribed_id = ? AND expires > since", (user_id,subscribed_id))
        if data:
            expiration_date = data["expires"]

            remaining_time = (expiration_date - datetime.now()).seconds
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close_connection()

    return remaining_time

def verify_token(token: str):
    """
    Given a token verifies token and decodes the token into an email
    """
    try:
        email = serializer.loads(token, salt='1', max_age=3600)
        return email
    except Exception as e:
        print(f"Error: {e}")
        return False

def reset_password(new_password: str, email: str):
    """
    Given email and new password reset the password for a given user
    """
    db = Database()
    db.create_connection()

    try:
        db.execute("UPDATE users SET password = ? WHERE email = ?", (generate_password_hash(new_password), email))
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        db.close_connection()