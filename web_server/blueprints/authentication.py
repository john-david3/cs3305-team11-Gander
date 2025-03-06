from flask import Blueprint, session, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import cross_origin
from database.database import Database
from blueprints.middleware import login_required
from utils.user_utils import get_user_id
from utils.utils import sanitize
from secrets import token_hex
from utils.path_manager import PathManager

auth_bp = Blueprint("auth", __name__)

path_manager = PathManager()

@auth_bp.route("/signup", methods=["POST"])
@cross_origin(supports_credentials=True)
def signup():
    """
    Route that allows a user to sign up by providing a `username`, `email` and `password`.
    """
    # ensure a JSON request is made to contact this route
    if not request.is_json:
        return jsonify({"message": "Expected JSON data"}), 400

    # Extract data from request via JSON
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Validation - ensure all fields exist, users cannot have an empty field
    if not all([username, email, password]):
        error_fields = get_error_fields([username, email, password]) #!←← find the error_fields, to highlight them in red to the user on the frontend
        return jsonify({
            "account_created": False,
            "error_fields": error_fields,
            "message": "Missing required fields"
        }), 400
    
    # Sanitize the inputs - helps to prevent SQL injection
    try:
        username = sanitize(username, "username")
        email = sanitize(email, "email")
        password = sanitize(password, "password")
    except ValueError as e:
        error_fields = get_error_fields([username, email, password])
        return jsonify({
            "account_created": False,
            "error_fields": error_fields,
            "message": "Invalid input received"
        }), 400

    # Create a connection to the database
    db = Database()

    try:
        # Check for duplicate email/username, no two users can have the same
        dup_email = db.fetchone(
            "SELECT * FROM users WHERE email = ?",
            (email,)
        )

        dup_username = db.fetchone(
            "SELECT * FROM users WHERE username = ?",
            (username,)
        )

        if dup_email is not None:
            return jsonify({
                "account_created": False,
                "error_fields": ["email"],
                "message": f"Email already taken: {email}"
            }), 400

        if dup_username is not None:
            return jsonify({
                "account_created": False,
                "error_fields": ["username"],
                "message": "Username already taken"
            }), 400

        # Create new user once input is validated
        db.execute(
            """INSERT INTO users 
               (username, password, email, stream_key)
               VALUES (?, ?, ?, ?)""",
            (
                username,
                generate_password_hash(password),
                email,
                token_hex(32)
            )
        )

        # Create user directories for stream data
        path_manager.create_user(username)

        return jsonify({
            "account_created": True,
            "message": "Account created successfully"
        }), 201

    except Exception as e:
        print(f"Error during signup: {e}")  # Log the error
        return jsonify({
            "account_created": False,
            "message": "Server error occurred: " + str(e)
        }), 500

    finally:
        db.close_connection()
        

@auth_bp.route("/login", methods=["POST"])
@cross_origin(supports_credentials=True)
def login():
    """
    Login to the web app with existing credentials.
    """

    # ensure a JSON request is made to contact this route
    if not request.is_json:
        return jsonify({"message": "Expected JSON data"}), 400

    # Extract data from request via JSON
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

   # Validation - ensure all fields exist, users cannot have an empty field
    if not all([username, password]):
        return jsonify({
            "logged_in": False,
            "message": "Missing required fields"
        }), 400
    
    # Sanitize the inputs - helps to prevent SQL injection
    try:
        username = sanitize(username, "username")
        password = sanitize(password, "password")
    except ValueError as e:
        return jsonify({
            "account_created": False,
            "error_fields": ["username", "password"],
            "message": "Invalid input received"
        }), 400
    
    # Create a connection to the database
    db = Database()

    try:
        # Check if user exists, only existing users can be logged in
        user = db.fetchone(
            "SELECT * FROM users WHERE username = ?",
            (username,)
        )

        if not user:
            return jsonify({
                "logged_in": False,
                "error_fields": ["username", "password"],
                "message": "Invalid username or password"
            }), 401

        # Verify password matches the password associated with that user
        if not check_password_hash(user["password"], password):
            return jsonify({
                "logged_in": False,
                "error_fields": ["username", "password"],
                "message": "Invalid username or password"
            }), 401
        
        # Add user directories for stream data in case they don't exist
        path_manager.create_user(username)

        # Set up session
        session.clear()
        session["username"] = username
        session["user_id"] = get_user_id(username)
        print(f"Logged in as {username}. session: {session.get('username')}. user_id: {session.get('user_id')}", flush=True)

        # User has been logged in, let frontend know that
        return jsonify({
            "logged_in": True,
            "message": "Login successful",
            "username": username
        }), 200

    except Exception as e:
        print(f"Error during login: {e}")  # Log the error
        return jsonify({
            "logged_in": False,
            "message": "Server error occurred"
        }), 500

    finally:
        db.close_connection()


@auth_bp.route("/logout")
@login_required
def logout() -> dict:
    """
    Log out and clear the users session.
    
    If the user is currently streaming, end their stream first.
    Can only be accessed by a logged in user.
    """
    from database.database import Database
    from utils.stream_utils import end_user_stream
    
    # Check if user is currently streaming
    user_id = session.get("user_id")
    username = session.get("username")
    
    with Database() as db:
        is_streaming = db.fetchone("""SELECT is_live FROM users WHERE user_id = ?""", (user_id,))
        
        if is_streaming and is_streaming.get("is_live") == 1:
            # Get the user's stream key
            stream_key_info = db.fetchone("""SELECT stream_key FROM users WHERE user_id = ?""", (user_id,))
            stream_key = stream_key_info.get("stream_key") if stream_key_info else None
            
            if stream_key:
                # End the stream
                end_user_stream(stream_key, user_id, username)
    session.clear()
    return {"logged_in": False}

def get_error_fields(values: list):
    fields = ["username", "email", "password"]
    return [fields[i] for i, v in enumerate(values) if not v]