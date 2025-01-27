from flask import Blueprint, session, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import cross_origin
from database.database import Database
from blueprints.utils import login_required, sanitizer

auth_bp = Blueprint("auth", __name__)


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
        fields = ["username", "email", "password"]
        for x in fields:
            if not [username, email, password][fields.index(x)]:
                fields.remove(x)
        return jsonify({
            "account_created": False,
            "error_fields": fields,
            "message": "Missing required fields"
        }), 400
    
    # Sanitize the inputs - helps to prevent SQL injection
    try:
        username = sanitizer(username, "username")
        email = sanitizer(email, "email")
        password = sanitizer(password, "password")
    except ValueError as e:
        return jsonify({
            "account_created": False,
            "error_fields": fields,
            "message": "Invalid input received"
        }), 400

    # Create a connection to the database
    db = Database()
    cursor = db.create_connection()

    try:
        # Check for duplicate email/username, no two users can have the same
        dup_email = cursor.execute(
            "SELECT * FROM users WHERE email = ?",
            (email,)
        ).fetchone()

        dup_username = cursor.execute(
            "SELECT * FROM users WHERE username = ?",
            (username,)
        ).fetchone()

        if dup_email is not None:
            return jsonify({
                "account_created": False,
                "error_fields": ["email"],
                "message": "Email already taken"
            }), 400

        if dup_username is not None:
            return jsonify({
                "account_created": False,
                "error_fields": ["username"],
                "message": "Username already taken"
            }), 400

        # Create new user once input is validated
        cursor.execute(
            """INSERT INTO users 
               (username, password, email, num_followers, bio)
               VALUES (?, ?, ?, ?, ?)""",
            (
                username,
                generate_password_hash(password),
                email,
                0,
                "This user does not have a Bio."
            )
        )
        db.commit_data()

        # Create session for new user, to avoid them having unnecessary state info
        session.clear()
        session["username"] = username

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
        username = sanitizer(username, "username")
        password = sanitizer(password, "password")
    except ValueError as e:
        return jsonify({
            "account_created": False,
            "error_fields": [username, password],
            "message": "Invalid input received"
        }), 400
    
    # Create a connection to the database
    db = Database()
    cursor = db.create_connection()

    try:
        # Check if user exists, only existing users can be logged in
        user = cursor.execute(
            "SELECT * FROM users WHERE username = ?",
            (username,)
        ).fetchone()

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

        # Set up session to avoid having unncessary state information
        session.clear()
        session["username"] = username

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
    
    Can only be accessed by a logged in user.
    """
    session.clear()
    return {"logged_in": False}
