from database.database import Database
from typing import Optional, List, Tuple

def user_recommendation_category(user_id: int) -> Optional[int]:
    """
    Queries user_preferences database to find users favourite streaming category and returns the category
    """
    db = Database()
    db.create_connection()

    data = db.fetchone(
        "SELECT category_id FROM user_preferences WHERE user_id = ? ORDER BY favourability DESC LIMIT 1", (user_id,))
    db.close_connection()
    return data

def followed_categories_recommendations(user_id: int):
    """
    Returns top 25 streams given a users category following
    """
    db = Database()
    db.create_connection()

    categories = db.fetchall("""
                             SELECT users.user_id, title, username, num_viewers, category_name 
                             FROM streams 
                             WHERE category_id IN (SELECT category_id FROM categories WHERE user_id = ?)
                             ORDER BY num_viewers DESC
                             LIMIT 25;  """, (user_id,))
    db.close_connection()
    return categories

def recommendations_based_on_category(category_id: int) -> Optional[List[Tuple[int, str, int]]]:
    """
    Queries stream database to get top 25 most viewed streams based on given category and returns 
    (user_id, title, username, num_viewers, category_name)
    """
    db = Database()
    db.create_connection()

    data = db.fetchall("""
        SELECT users.user_id, title, username, num_viewers, category_name
        FROM streams 
        JOIN users ON users.user_id = streams.user_id
        JOIN categories ON streams.category_id = categories.category_id
        WHERE categories.category_id = ? 
        ORDER BY num_viewers DESC 
        LIMIT 25""", (category_id,))
    db.close_connection()
    return data

def default_recommendations():
    """
    Return a list of 25 recommended live streams by number of viewers
    (user_id, title, username, num_viewers, category_name)
    """
    db = Database()
    db.create_connection()
    data = db.fetchall("""
        SELECT users.user_id, title, username, num_viewers, category_name
        FROM streams 
        JOIN users ON users.user_id = streams.user_id 
        JOIN categories ON streams.category_id = categories.category_id
        ORDER BY num_viewers DESC 
        LIMIT 25
    """)
    db.close_connection()
    return data

