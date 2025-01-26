from database.database import Database
from user_utils import get_user_id
from typing import Optional, List, Tuple

def user_recommendation_category(username: str) -> Optional[int]:
    """
    Queries user_preferences database to find users favourite streaming category and returns the category
    """
    db = Database()
    cursor = db.create_connection()
    user_id = get_user_id(username)

    data = cursor.execute(
        "SELECT category_id FROM user_preferences WHERE user_id = ? ORDER BY favourability DESC LIMIT 1", (user_id,)).fetchone()
    return data[0]

def recommendations_based_on_category(category_id: int) -> Optional[List[Tuple[int, str, int]]]:
    """
    Queries stream database to get top 10 most viewed streams based on given category and returns (stream_id, title, num_viewers)
    """
    db = Database()
    cursor = db.create_connection()

    data = cursor.execute(
        "SELECT streamer_id, stream_id, title, num_viewers FROM streams WHERE category_id = ? ORDER BY num_viwers DESC LIMIT 10", (category_id,)).fetchall()
    return data