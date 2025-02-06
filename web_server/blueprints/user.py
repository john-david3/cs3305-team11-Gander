from flask import Blueprint, jsonify, session, abort, abort
from utils.user_utils import *
from blueprints.utils import login_required
from blueprints.email import send_email, forgot_password_body

user_bp = Blueprint("user", __name__)

@user_bp.route('/user/<string:username>')
def get_user_data_(username):
    """
    Returns a given user's data
    """
    user_id = get_user_id(username)
    if not user_id:
        abort(404)
    data = get_user_data(user_id)
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
@user_bp.route('/user/<int:user_id>/follows/<int:followed_id>')
def user_following(user_id: int, followed_id: int):
    """
    Checks to see if user is following a streamer
    """
    if is_following(user_id, followed_id):
        return jsonify({"following": True})
    return jsonify({"following": False})

@login_required
@user_bp.route('/user/follow/<string:username>')
def follow_user(username):
    """
    Follows a user
    """
    user_id = session.get("user_id")
    following_id = get_user_id(username)
    if follow(user_id, following_id):
        return jsonify({"success": True,
                        "already_following": False})
    return jsonify({"success": True,
                    "already_following": True})

@login_required
@user_bp.route('/user/unfollow/<string:username>')
def unfollow_user(username):
    """
    Unfollows a user
    """
    user_id = session.get("user_id")
    followed_id = get_user_id(username)
    unfollow(user_id, followed_id)
    return jsonify({"success": True})

@login_required
@user_bp.route('/user/following')
def get_followed_streamers_():
    """
    Queries DB to get a list of followed streamers
    """
    user_id = session.get('user_id')

    live_following_streams = get_followed_streamers(user_id)
    return live_following_streams

## Login Routes
@user_bp.route('/user/login_status')
def get_login_status():
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
    Will send link to email to reset password by looking at the user_id within session to see whos password should be reset
    Creates a super random number to be used a the link to reset password I guess a random number generator seeded with a secret
    """
    send_email(email, lambda: forgot_password_body(email))
    return email


@user_bp.route('/user/reset_password/<string:token>/<string:new_password>')
def user_reset_password(token, new_password):
    """
    Given token and new password resets the users password
    """
    email = verify_token(token)
    if email:
        response = reset_password(new_password, email)
        if response:
            return 200
        else:
            abort(500)
    return abort(500)