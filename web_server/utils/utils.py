from database.database import Database

def categories():
    """
    Returns all possible streaming categories
    """
    db = Database()
    all_categories = db.fetchall("SELECT * FROM categories")
    
    return all_categories

def tags():
    """
    Returns all possible streaming tags
    """
    db = Database()
    all_tags = db.fetchall("SELECT * FROM tags")
    
    return all_tags

def most_popular_category():
    """
    Returns the most popular category based on live stream viewers
    """
    db = Database()
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

