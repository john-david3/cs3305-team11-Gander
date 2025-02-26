from flask import Blueprint, session
from database.database import Database
from utils.utils import sanitize

admin_bp = Blueprint("admin", __name__)

@admin_bp.route('/ban_user/<int:banned_user>')
def admin_delete_user(banned_user):
    # Sanitise the user input
    banned_user = sanitize(banned_user)

    # Create a connection to the database
    db = Database()
    db.create_connection()

    # Check if the user is an admin
    username = session.get("username")
    is_admin = db.fetchone("""
                        SELECT is_admin
                        FROM users
                        WHERE username = ?;
                        """, (username,))
    
    # Check if the user exists
    user_exists = db.fetchone("""SELECT user_id from users WHERE username = ?;""", (banned_user))

    # If the user is an admin, try to delete the account
    if is_admin and user_exists:
        db.execute("""DELETE FROM users WHERE username = ?;""", (banned_user))