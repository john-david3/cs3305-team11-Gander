from database.database import Database
from typing import Optional, List, Tuple

def user_recommendation_category(user_id: int) -> Optional[int]:
    """
    Queries user_preferences database to find users favourite streaming category and returns the category
    """
    db = Database()
    data = db.fetchone("""
            SELECT category_id 
            FROM user_preferences 
            WHERE user_id = ? 
            ORDER BY favourability DESC 
            LIMIT 1
        """, (user_id,))
    return data

#TODO Needs to be reworked to get categories instead of streams of categories (below can be done in another function - get_streams_by_category)
def followed_categories_recommendations(user_id : int):
    """
    Returns top 25 streams given a users category following
    """
    db = Database()
    # TODO: Change this to do what the function says
    categories = db.fetchall("""
                        SELECT s.stream_id, s.title, u.username, s.num_viewers, c.category_name
                        FROM streams AS s
                        JOIN users AS u ON u.user_id = s.user_id
                        JOIN categories AS c ON s.category_id = c.category_id
                        JOIN followed_categories AS f ON s.category_id = c.category_id
                        WHERE f.user_id = ?
                        ORDER BY s.num_viewers DESC
                        LIMIT 25;

                    """, (user_id,))
    return categories

#TODO Needs to be reworked to get categories instead of streams of categories
def recommendations_based_on_category(category_id: int) -> Optional[List[Tuple[int, str, int]]]:
    """
    Queries stream database to get top 25 most viewed streams based on given category and returns 
    (user_id, title, username, num_viewers, category_name)
    """
    db = Database()
    data = db.fetchall("""
        SELECT streams.category_id, streams.user_id, streams.title, users.username, streams.num_viewers, categories.category_name
        FROM streams
        JOIN users ON users.user_id = streams.user_id
        JOIN categories ON streams.category_id = categories.category_id
        WHERE categories.category_id = ? 
        ORDER BY num_viewers DESC 
        LIMIT 25
                           """, (category_id,))
    return data

def default_recommendations():
    """
    Return a list of 25 recommended live streams by number of viewers
    (user_id, title, username, num_viewers, category_name)
    """
    db = Database()
    data = db.fetchall("""
        SELECT stream_id, users.user_id, title, username, num_viewers, category_name
        FROM streams 
        JOIN users ON users.user_id = streams.user_id 
        JOIN categories ON streams.category_id = categories.category_id
        ORDER BY num_viewers DESC 
        LIMIT 25;
    """)
    return data

def category_recommendations():
    """
    Returns a list of the top 5 most popular categories
    """
    db = Database()
    categories = db.fetchall("""
            SELECT categories.category_id, categories.category_name
            FROM streams
            JOIN categories ON streams.category_id = categories.category_id
            WHERE streams.isLive = 1
            GROUP BY categories.category_name
            ORDER BY SUM(streams.num_viewers) DESC
            LIMIT 5;
        """)
    return categories

