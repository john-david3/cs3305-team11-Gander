from database.database import Database
from typing import Optional, List
from re import match

def get_all_categories() -> Optional[List[dict]]:
    """
    Returns all possible streaming categories
    """
    with Database() as db:
        all_categories = db.fetchall("SELECT * FROM categories")
    
    return all_categories

def get_all_tags() -> Optional[List[dict]]:
    """
    Returns all possible streaming tags
    """
    with Database() as db:
        all_tags = db.fetchall("SELECT * FROM tags")
    
    return all_tags

def get_most_popular_category() -> Optional[List[dict]]:
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

def get_category_id(category_name: str):
    """
    Returns category_id given category_name
    """
    with Database() as db:
        category = db.fetchone("""
            SELECT category_id
            FROM categories
            WHERE category_name = ?
        """, (category_name,))

    return category["category_id"]

def sanitize(user_input: str, input_type="default") -> str:
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
        "default": {
            "pattern": r"^[\w\s]+$",  # Non-whitespace characters only
            "min_length": 1,
            "max_length": 50,
        },
    }

    # Get the validation rules for the specified type
    r = rules.get(input_type)
    if not r or \
    not (r["min_length"] <= len(sanitised_input) <= r["max_length"]) or \
    not match(r["pattern"], sanitised_input):
        raise ValueError("Unaccepted character or length in input")

    return sanitised_input