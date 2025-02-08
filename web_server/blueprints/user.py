from flask import Blueprint, jsonify, session
from utils.user_utils import *
from utils.auth import *
from blueprints.middleware import login_required
from utils.email import send_email, forgot_password_body
import redis

redis_url = "redis://redis:6379/1"
r = redis.from_url(redis_url, decode_responses=True)

user_bp = Blueprint("user", __name__)

@user_bp.route('/user/<string:username>')
def user_data(username: str):
    """
    Returns a given user's data
    """
    user_id = get_user_id(username)
    if not user_id:
        jsonify({"error": "User not found from username"}), 404
    data = get_user(user_id)
    return jsonify(data)

## Subscription Routes
@login_required
@user_bp.route('/user/subscription/<int:subscribed_id>')
def user_subscribed(subscribed_id: int):
    """
    Checks to see if user is subscribed to another user
    """
    user_id = session.get("user_id")
    if is_subscribed(user_id, subscribed_id):
        return jsonify({"subscribed": True})
    return jsonify({"subscribed": False})

@login_required
@user_bp.route('/user/subscription/<int:subscribed_id>/expiration')
def user_subscription_expiration(subscribed_id: int):
    """
    Returns remaining time until subscription expiration
    """

    user_id = session.get("user_id")
    remaining_time = subscription_expiration(user_id, subscribed_id)

    return jsonify({"remaining_time": remaining_time})

## Follow Routes
@user_bp.route('/user/following/<string:followed_username>')
def user_following(followed_username: str):
    """
    Checks to see if user is following another streamer
    """
    user_id = session.get("user_id")
    followed_id = get_user_id(followed_username)
    if is_following(user_id, followed_id):
        return jsonify({"following": True})
    return jsonify({"following": False})

@login_required
@user_bp.route('/user/follow/<int:target_user_id>')
def user_follow(target_user_id: int):
    """
    Follows a user
    """
    user_id = session.get("user_id")
    return follow(user_id, target_user_id)

@login_required
@user_bp.route('/user/unfollow/<string:target_user_id>')
def user_unfollow(target_user_id: int):
    """
    Unfollows a user
    """
    user_id = session.get("user_id")
    return unfollow(user_id, target_user_id)

@login_required
@user_bp.route('/user/following')
def user_followed_streamers():
    """
    Queries DB to get a list of followed streamers
    """
    user_id = session.get('user_id')

    live_following_streams = get_followed_streamers(user_id)
    return live_following_streams

## Login Routes
@user_bp.route('/user/login_status')
def user_login_status():
    """
    Returns whether the user is logged in or not
    """
    username = session.get("username")
    user_id = session.get("user_id")
    return jsonify({'status': username is not None, 
                    'username': username,
                    'user_id': user_id})

@user_bp.route('/user/forgot_password/<string:email>', methods=['GET','POST'])
def user_forgot_password(email):
    """
    Initializes the function to handle password reset
    """
    send_email(email, lambda: forgot_password_body(email))
    return email


@user_bp.route('/user/reset_password/<string:token>/<string:new_password>', methods=['POST'])
def user_reset_password(token, new_password):
    """
    Given token and new password resets the users password
    """
    salt_value = r.get(token)
    if salt_value:
            r.delete(token)

    email = verify_token(token, salt_value)

    if email:
        response = reset_password(new_password, email)
        if response:
            return 200
        else:
            return jsonify({"error": "Failed to reset password"}), 500
    return jsonify({"error": "Invalid token"}), 400