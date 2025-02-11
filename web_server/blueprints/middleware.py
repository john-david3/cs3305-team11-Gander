from flask import redirect, url_for, request, g, session
from functools import wraps
import logging

def logged_in_user():
    """
    Validator to make sure a user is logged in.
    """
    g.user = session.get("username", None)
    g.admin = session.get("username", None)

def login_required(view):
    """
    Add at start of routes where users need to be logged in to access.
    """
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.user is None:
            return redirect(url_for("login", next=request.url))
        return view(*args, **kwargs)
    return wrapped_view

def admin_required(view):
    """
    Add at start of routes where admins need to be logged in to access.
    """
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.admin != "admin":
            return redirect(url_for("login", next=request.url))
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