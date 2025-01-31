from database.database import Database
from typing import Optional, List

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
