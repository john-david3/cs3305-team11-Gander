from database.database import Database
from typing import Optional, List


def get_user_preferred_category(user_id: int) -> Optional[int]:
    """
    Queries user_preferences database to find users favourite streaming category and returns the category
    """
    with Database() as db:
        category = db.fetchone("""
            SELECT category_id 
            FROM user_preferences 
            WHERE user_id = ? 
            ORDER BY favourability DESC 
            LIMIT 1
        """, (user_id,))
    return category["category_id"] if category else None


def get_followed_categories_recommendations(user_id: int, no_streams: int = 4) -> Optional[List[dict]]:
    """
    Returns top streams given a user's category following
    """
    with Database() as db:
        streams = db.fetchall("""
            SELECT u.user_id, title, u.username, num_viewers, category_name 
            FROM streams 
            JOIN users u ON streams.user_id = u.user_id
            JOIN categories ON streams.category_id = categories.category_id
            WHERE categories.category_id IN (SELECT category_id FROM followed_categories WHERE user_id = ?)
            ORDER BY num_viewers DESC
            LIMIT ?;
        """, (user_id, no_streams))
    return streams


def get_streams_based_on_category(category_id: int, no_streams: int = 4) -> Optional[List[dict]]:
    """
    Queries stream database to get top most viewed streams based on given category
    """
    with Database() as db:
        streams = db.fetchall("""
            SELECT u.user_id, title, username, num_viewers, c.category_name
            FROM streams s
            JOIN users u ON s.user_id = u.user_id
            JOIN categories c ON s.category_id = c.category_id
            WHERE c.category_id = ? 
            ORDER BY num_viewers DESC 
            LIMIT ?
        """, (category_id, no_streams))
    return streams


def get_highest_view_streams(no_streams: int = 4) -> Optional[List[dict]]:
    """
    Return a list of live streams by number of viewers
    """
    with Database() as db:
        data = db.fetchall("""
            SELECT u.user_id, username, title, num_viewers, category_name
            FROM streams 
            JOIN users u ON streams.user_id = u.user_id
            JOIN categories ON streams.category_id = categories.category_id
            ORDER BY num_viewers DESC 
            LIMIT ?;
        """, (no_streams,))
        return data

def get_highest_view_categories(no_categories: int = 4) -> Optional[List[dict]]:
    """
    Returns a list of top most popular categories
    """
    with Database() as db:
        categories = db.fetchall("""
            SELECT categories.category_id, categories.category_name, SUM(streams.num_viewers) AS num_viewers
            FROM streams
            JOIN categories ON streams.category_id = categories.category_id
            GROUP BY categories.category_name
            ORDER BY SUM(streams.num_viewers) DESC
            LIMIT ?;
        """, (no_categories,))
    return categories

def get_user_category_recommendations(user_id: int, no_categories: int = 4) -> Optional[List[dict]]:
    """
    Queries user_preferences database to find users top favourite streaming category and returns the category
    """
    with Database() as db:
        categories = db.fetchall("""
            SELECT categories.category_id, categories.category_name
            FROM categories 
            JOIN user_preferences ON categories.category_id = user_preferences.category_id
            WHERE user_id = ? 
            ORDER BY favourability DESC 
            LIMIT ?
        """, (user_id, no_categories))
    return categories