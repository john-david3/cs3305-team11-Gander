from flask import Blueprint
from database.database import Database

user_bp = Blueprint("stream", __name__)

@user_bp.route('/is_subscribed/<int:user_id>/<int:streamer_id>', methods=['GET'])
def user_subscribed(user_id, streamer_id):
    """
    Checks to see if user is subscribed to a streamer
    """
    db = Database()
    cursor = db.create_connection()
    return

@user_bp.route('/is_following/<int:user_id>/<int:streamer_id>', methods=['GET'])
def user_following(user_id, streamer_id):
    """
    Checks to see if user is following a streamer
    """
    return

@user_bp.route('/subscription_remaining/<int:user_id>/<int:streamer_id>', methods=['GET'])
def user_subscription_expiration(user_id, streamer_id):
    """
    Returns remaining time until subscription expiration
    """
    return

@user_bp.route('/get_login_status')
def get_login_status():
    logged_in = False
    """
    Returns whether the user is logged in or not
    """
    return {"logged_in": logged_in}

@user_bp.route('/authenticate_user')
def authenticate_user():
    """
    Authenticates the user
    """
    return {"authenticated": True}
