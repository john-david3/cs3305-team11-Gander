from database.database import Database

def categories():
    """
    Returns all possible streaming categories
    """
    db = Database()
    cursor = db.create_connection()
    all_categories = cursor.execute("SELECT * FROM categories").fetchall()
    return all_categories

def tags():
    """
    Returns all possible streaming tags
    """
    db = Database()
    cursor = db.create_connection()
    all_tags = cursor.execute("SELECT * FROM tags").fetchall()
    return all_tags

def most_popular_category():
    """
    Returns the most popular category based on live stream viewers
    """
    db = Database()
    cursor = db.create_connection()

    category = cursor.execute("""
        SELECT categories.category_id, categories.category_name
        FROM streams
        JOIN categories ON streams.category_id = categories.category_id
        WHERE streams.isLive = 1
        GROUP BY categories.category_name
        ORDER BY SUM(streams.num_viewers) DESC
        LIMIT 1;
    """).fetchone()

    return category

