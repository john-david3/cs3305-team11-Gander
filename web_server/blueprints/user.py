from flask import Blueprint, jsonify, session
from utils.user_utils import is_subscribed, is_following, subscription_expiration

user_bp = Blueprint("user", __name__)

@user_bp.route('/is_subscribed/<int:user_id>/<int:streamer_id>')
def user_subscribed(user_id: int, streamer_id: int):
    """
    Checks to see if user is subscribed to a streamer
    """
    if is_subscribed(user_id, streamer_id):
        return jsonify({"subscribed": True})
    return jsonify({"subscribed": False})

@user_bp.route('/is_following/<int:user_id>/<int:streamer_id>')
def user_following(user_id: int, streamer_id: int):
    """
    Checks to see if user is following a streamer
    """
    if is_following(user_id, streamer_id):
        return jsonify({"following": True})
    return jsonify({"following": False})       


@user_bp.route('/subscription_remaining/<int:user_id>/<int:streamer_id>')
def user_subscription_expiration(user_id: int, streamer_id: int):
    """
    Returns remaining time until subscription expiration
    """
    remaining_time = subscription_expiration(user_id, streamer_id)
        
    return jsonify({"remaining_time": remaining_time})
    
@user_bp.route('/get_login_status')
def get_login_status():
    """
    Returns whether the user is logged in or not
    """
    return jsonify(session.get("username") is not None)

@user_bp.route('/authenticate_user')
def authenticate_user() -> dict:
    """
    Authenticates the user
    """
    return {"authenticated": True}

@user_bp.route('/forgot_password', methods=['POST'])
def forgot_password():
    """
    Will send link to email to reset password by looking at the user_id within session to see whos password should be reset
    Creates a super random number to be used a the link to reset password I guess a random number generator seeded with a secret
    """
    return
