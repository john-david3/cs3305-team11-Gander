from database.database import Database
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from typing import Optional
from dotenv import load_dotenv
from os import getenv
from werkzeug.security import generate_password_hash
load_dotenv()

serializer = URLSafeTimedSerializer(getenv("AUTH_SECRET_KEY"))
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