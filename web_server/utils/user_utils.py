from database.database import Database
from typing import Optional, List
from datetime import datetime
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from os import getenv
from werkzeug.security import generate_password_hash
from dateutil import parser
from dotenv import load_dotenv
load_dotenv()

serializer = URLSafeTimedSerializer(getenv("AUTH_SECRET_KEY"))

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

