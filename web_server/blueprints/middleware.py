from flask import redirect, url_for, request, g, session
from functools import wraps
import logging
from os import getenv
from dotenv import load_dotenv
from database.database import Database

load_dotenv()

def logged_in_user():
    """
    Validator to make sure a user is logged in.
    """
    db = Database()
    db.create_connection()

    g.user = session.get("username", None)
    g.admin = db.fetchone("""SELECT is_admin FROM users
                            WHERE username = ?;""",
                            (session.get("username"),)
                        )

def login_required(view):
    """
    Add at start of routes where users need to be logged in to access.
    """
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.user is None:
            return redirect(getenv("HOMEPAGE_URL"))
        return view(*args, **kwargs)
    return wrapped_view

def admin_required(view):
    """
    Add at start of routes where admins need to be logged in to access.
    """
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.admin == 0:
            return redirect(getenv("HOMEPAGE_URL"))
        return view(*args, **kwargs)
    return wrapped_view

def register_error_handlers(app):
    """
    Default reponses to status codes
    """
    error_responses = {
        400: "Bad Request",
        403: "Forbidden",
        404: "Not Found",
        500: "Internal Server Error"
    }

    for code, message in error_responses.items():
        @app.errorhandler(code)
        def handle_error(error, message=message, code=code):
            logging.error(f"Error {code}: {str(error)}")
            return {"error": message}, code