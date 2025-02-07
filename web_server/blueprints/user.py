from flask import Blueprint, jsonify, session
from utils.user_utils import *
from blueprints.utils import login_required
from blueprints.email import send_email, forgot_password_body
import redis

redis_url = "redis://redis:6379/1"
r = redis.from_url(redis_url, decode_responses=True)

user_bp = Blueprint("user", __name__)

@user_bp.route('/user/<string:username>')
def get_user_data(username: str):
    """
    Returns a given user's data
    """
    user_id = get_user_id(username)
    if not user_id:
        jsonify({"error": "User not found from username"}), 404
    data = get_user(user_id)
    return jsonify(data)

def get_user_id(username: str) -> Optional[int]:
    """
    Returns user_id associated with given username
    """
    with Database() as db:
        data = db.fetchone("""
            SELECT user_id 
            FROM users 
            WHERE username = ?
        """, (username,))
    return data['user_id'] if data else None

def get_username(user_id: str) -> Optional[str]:
    """
    Returns username associated with given user_id
    """
    with Database() as db:
        data = db.fetchone("""
            SELECT username 
            FROM user 
            WHERE user_id = ?
        """, (user_id,))
    return data['username'] if data else None

def get_email(user_id: int) -> Optional[str]:
    with Database() as db:
        email = db.fetchone("""
            SELECT email
            FROM users
            WHERE user_id = ?
        """, (user_id,))
    
    return email["email"] if email else None

def get_session_info_email(email: str) -> dict:
    """
    Returns username and user_id given email
    """
    with Database() as db:
        session_info = db.fetchone("""
            SELECT user_id, username
            FROM user
            WHERE email = ?
        """, (email,))
        return session_info
    
def is_user_partner(user_id: int) -> bool:
    """
    Returns True if user is a partner, else False
    """
    with Database() as db:
        data = db.fetchone("""
            SELECT is_partnered 
            FROM users 
            WHERE user_id = ?
        """, (user_id,))
    return bool(data)

def get_user(user_id: int) -> Optional[dict]:
    """
    Returns information about a user from user_id
    """
    with Database() as db:
        data = db.fetchone("""
            SELECT user_id, username, bio, num_followers, is_partnered, is_live FROM users
            WHERE user_id = ?;
        """, (user_id,))
    return data

## Subscription Routes
def is_subscribed(user_id: int, subscribed_to_id: int) -> bool:
    """
    Returns True if user is subscribed to a streamer, else False
    """
    with Database() as db:
        result = db.fetchone("""
            SELECT *
            FROM subscribes 
            WHERE user_id = ? 
            AND subscribed_id = ?
            AND expires > ?;
        """, (user_id, subscribed_to_id, datetime.now()))
    print(result)
    if result:
        return True
    return False

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
    with Database() as db:
        data = db.fetchone("""
            SELECT expires 
            FROM subscribes 
            WHERE user_id = ? 
            AND subscribed_id = ? 
            AND expires > ?
        """, (session.get("user_id"), subscribed_id, datetime.now()))

    if data:
        expiration_date = data["expires"]
        remaining_time = (parser.parse(expiration_date) - datetime.now()).seconds
    else:
        remaining_time = 0
    
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
def follow_user(target_user_id: int):
    """
    Follows a user
    """
    user_id = session.get("user_id")
    return follow(user_id, target_user_id)

@login_required
@user_bp.route('/user/unfollow/<int:target_user_id>')
def unfollow_user(target_user_id: int):
    """
    Unfollows a user
    """
    user_id = session.get("user_id")
    return unfollow(user_id, target_user_id)

@login_required
@user_bp.route('/user/following')
def get_followed_streamers():
    """
    Queries DB to get a list of followed streamers
    """
    user_id = session.get('user_id')

    with Database() as db:
        followed_streamers = db.fetchall("""
            SELECT user_id, username
            FROM users
            WHERE user_id IN (SELECT followed_id FROM follows WHERE user_id = ?);
        """, (user_id,))

    return followed_streamers

def get_followed_live_streams(user_id: int) -> Optional[List[dict]]:
    """
    Searches for streamers who the user followed which are currently live
    Returns a list of live streams with the streamer's user id, stream title, and number of viewers
    """
    with Database() as db:
        live_streams = db.fetchall("""
                                    SELECT users.user_id, streams.title, streams.num_viewers, users.username
                                    FROM streams JOIN users 
                                    ON streams.user_id = users.user_id
                                    WHERE users.user_id IN
                                    (SELECT followed_id FROM follows WHERE user_id = ?)
                                    AND users.is_live = 1;
                                """, (user_id,))
    return live_streams

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