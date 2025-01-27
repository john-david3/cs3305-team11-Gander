from flask import Blueprint, session, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import cross_origin
from database.database import Database
from blueprints.utils import login_required, sanitizer

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signup", methods=["POST"])
@cross_origin(supports_credentials=True)
def signup():
    if not request.is_json:
        return jsonify({"message": "Expected JSON data"}), 400

    data = request.get_json()

    # Extract data from request
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Basic server-side validation
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
    
    # Sanitize the inputs
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
        # Check for duplicate email/username
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

        # Create new user
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

        # Create session for new user
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
    if not request.is_json:
        return jsonify({"message": "Expected JSON data"}), 400

    data = request.get_json()

    # Extract data from request
    username = data.get('username')
    password = data.get('password')

    # Basic server-side validation
    if not all([username, password]):
        return jsonify({
            "logged_in": False,
            "message": "Missing required fields"
        }), 400

    db = Database()
    cursor = db.create_connection()

    try:
        # Check if user exists
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

        # Verify password
        if not check_password_hash(user["password"], password):
            return jsonify({
                "logged_in": False,
                "error_fields": ["username", "password"],
                "message": "Invalid username or password"
            }), 401

        # Set up session
        session.clear()
        session["username"] = username

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
def logout():
    session.clear()
    return {"logged_in": False}
