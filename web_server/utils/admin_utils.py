from database.database import Database

def check_if_admin(username):
    """
   Returns whether user is admin 
    """
    with Database() as db:
        is_admin = db.fetchone("""
                    SELECT is_admin
                    FROM users
                    WHERE username = ?;
                    """, (username,))
        
        return bool(is_admin)

def check_if_user_exists(banned_user):
    """
    Returns whether user exists
    """
    with Database() as db:
        user_exists = db.fetchone("""
                    SELECT user_id 
                    FROM users
                    WHERE username = ?;""",
                (banned_user,))
        
        return bool(user_exists)

def ban_user(banned_user):
    """
    Bans a user
    """
    with Database() as db:
        db.execute("""
                    DELETE FROM users
                    WHERE username = ?;""", 
                    (banned_user)
                )