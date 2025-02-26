from database.database import Database

def check_if_admin(username):
    # Create a connection to the database
    db = Database()
    db.create_connection()

    is_admin = db.fetchone("""
                SELECT is_admin
                FROM users
                WHERE username = ?;
                """, (username,))
    
    return is_admin

def check_if_user_exists(banned_user):
    # Create a connection to the database
    db = Database()
    db.create_connection()

    user_exists = db.fetchone("""
                SELECT user_id 
                FROM users
                WHERE username = ?;""",
            (banned_user,))
    
    return user_exists

def ban_user(banned_user):
    """Ban a user."""
    # Create a connection to the database
    db = Database()
    db.create_connection()

    db.execute("""
                DELETE FROM users
                WHERE username = ?;""", 
                (banned_user)
            )