from flask import redirect, url_for, request, g, session
from functools import wraps
from re import match
from database.database import Database
from typing import Optional, List

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

def categories() -> Optional[List[dict]]:
    """
    Returns all possible streaming categories
    """
    with Database() as db:
        all_categories = db.fetchall("SELECT * FROM categories")
    
    return all_categories

def tags() -> Optional[List[dict]]:
    """
    Returns all possible streaming tags
    """
    with Database() as db:
        all_tags = db.fetchall("SELECT * FROM tags")
    
    return all_tags

def most_popular_category() -> Optional[List[dict]]:
    """
    Returns the most popular category based on live stream viewers
    """
    with Database() as db:
        category = db.fetchone("""
            SELECT categories.category_id, categories.category_name
            FROM streams
            JOIN categories ON streams.category_id = categories.category_id
            WHERE streams.isLive = 1
            GROUP BY categories.category_name
            ORDER BY SUM(streams.num_viewers) DESC
            LIMIT 1;
        """)
    
    return category