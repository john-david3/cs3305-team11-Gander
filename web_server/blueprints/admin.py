from flask import Blueprint, session
from utils.utils import sanitize
from utils.admin_utils import *

admin_bp = Blueprint("admin", __name__)

@admin_bp.route('/ban_user/<int:banned_user>')
def admin_delete_user(banned_user):
    """
    Only to be used by a user who has admin privileges.

    Contacts the database to ban a user for violation Terms of Service.
    """

    # Sanitise the user input
    banned_user = sanitize(banned_user)

    # Check if the user is an admin
    username = session.get("username")
    is_admin = check_if_admin(username)
    
    # Check if the user exists
    user_exists = check_if_user_exists(banned_user)

    # If the user is an admin, try to delete the account
    if is_admin and user_exists:
        ban_user(banned_user)