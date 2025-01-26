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