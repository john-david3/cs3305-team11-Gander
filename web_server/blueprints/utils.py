from flask import redirect, url_for, request, g, session
from functools import wraps
from re import match
from time import time

def logged_in_user():
    """
    Validator to make sure a user is logged in.
    """
    g.start_time = time()
    g.user = session.get("username", None)
    print(f"Path: {request.path}, session username: {g.user}", flush=True)
    g.admin = session.get("username", None)

def record_time(response):
    if hasattr(g, 'start_time'):
            time_taken = time() - g.start_time
            print(f"Request to {request.endpoint} took {time_taken:.4f} seconds", flush=True)
    else:
        print("No start time found", flush=True)
    return response

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

def sanitizer(user_input: str, input_type="username") -> str:
    """
    Sanitizes user input based on the specified input type.
    
    `input_type`: The type of input to sanitize (e.g., 'username', 'email', 'password').
    """
    # Strip leading and trailing whitespace
    sanitised_input = user_input.strip()

    # Define allowed patterns and length constraints for each type
    rules = {
        "username": {
            "pattern": r"^[a-zA-Z0-9_]+$",  # Alphanumeric + underscores
            "min_length": 3,
            "max_length": 50,
        },
        "email": {
            "pattern": r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",  # Standard email regex
            "min_length": 5,
            "max_length": 128,
        },
        "password": {
            "pattern": r"^[\S]+$",  # Non-whitespace characters only
            "min_length": 8,
            "max_length": 256,
        },
    }

    # Get the validation rules for the specified type
    r = rules.get(input_type)
    if not r or \
    not (r["min_length"] <= len(sanitised_input) <= r["max_length"]) or \
    not match(r["pattern"], sanitised_input):
        raise ValueError("Unaccepted character or length in input")

    return sanitised_input
