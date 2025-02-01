from flask import Blueprint, jsonify, session
from utils.user_utils import is_subscribed, is_following, subscription_expiration, verify_token, reset_password, get_user_id, unfollow
from blueprints.utils import login_required

user_bp = Blueprint("user", __name__)

@login_required
@user_bp.route('/is_subscribed/<int:subscribed_id>')
def user_subscribed(subscribed_id: int):
    """
    Checks to see if user is subscribed to another user
    """
    user_id = session.get("user_id")
    if is_subscribed(user_id, subscribed_id):
        return jsonify({"subscribed": True})
    return jsonify({"subscribed": False})

@user_bp.route('/is_following/<int:user_id>/<int:subscribed_id>')
def user_following(user_id: int, subscribed_id: int):
    """
    Checks to see if user is following a streamer
    """
    if is_following(user_id, subscribed_id):
        return jsonify({"following": True})
    return jsonify({"following": False})

@login_required
@user_bp.route('/unfollow/<int:username>')
def user_unfollow(followed_username):
    """
    Unfollows a user
    """
    user_id = session.get("user_id")
    followed_id = get_user_id(followed_username)
    status = unfollow(user_id, followed_id)

    status = True if status else False
    return jsonify({"status": status})

@login_required
@user_bp.route('/subscription_remaining/<int:streamer_id>')
def user_subscription_expiration(streamer_id: int):
    """
    Returns remaining time until subscription expiration
    """

    user_id = session.get("user_id")
    remaining_time = subscription_expiration(user_id, streamer_id)

    return jsonify({"remaining_time": remaining_time})
    
@user_bp.route('/get_login_status')
def get_login_status():
    """
    Returns whether the user is logged in or not
    """
    username = session.get("username")
    return jsonify({'status': username is not None, 'username': username})

@user_bp.route('/forgot_password', methods=['POST'])
def user_forgot_password():
    """
    Will send link to email to reset password by looking at the user_id within session to see whos password should be reset
    Creates a super random number to be used a the link to reset password I guess a random number generator seeded with a secret
    """
    return

@user_bp.route('/reset_password/<string:token>/<string:new_password>')
def user_reset_password(token, new_password):
    """
    Given token and new password resets the users password
    """
    email = verify_token(token)
    if email:
        response = reset_password(new_password, email)
        if response:
            return "Success"
        else:
            return "Failure"
    return "Failure"