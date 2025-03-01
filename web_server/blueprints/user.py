from flask import Blueprint, jsonify, session, request
from utils.user_utils import *
from utils.auth import *
from utils.utils import get_category_id
from blueprints.middleware import login_required
from utils.email import send_email, forgot_password_body, newsletter_conf
from utils.path_manager import PathManager
from celery_tasks.streaming import convert_image_to_png
import redis

from io import BytesIO
from PIL import Image

redis_url = "redis://redis:6379/1"
r = redis.from_url(redis_url, decode_responses=True)

user_bp = Blueprint("user", __name__)

path_manager = PathManager()

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

@login_required
@user_bp.route('/user/<string:username>/stream_key')
def user_stream_key(username: str):
    """
    Returns a stream key for a given user
    """
    user_id = get_user_id(username)
    with Database() as db:
        data = db.fetchone("SELECT stream_key FROM users WHERE user_id = ?", (user_id,))
    return jsonify({"stream_key": data["stream_key"]})

@login_required
@user_bp.route('/user/profile_picture/upload', methods=['POST'])
def user_profile_picture_save():
    """
    Saves user profile picture
    """
    username = session.get("username")
    thumbnail_path = path_manager.get_profile_picture_file_path(username)
    
    # Check if the post request has the file part
    if 'image' not in request.files:
        return jsonify({"error": "No image found in request"}), 400
    
    # Fetch image, convert to png, and save
    image = Image.open(request.files['image'])
    image.convert('RGB')
    image.save(thumbnail_path, "PNG")

    return jsonify({"message": "Profile picture saved"})

@login_required
@user_bp.route('/user/same/<string:username>')
def user_is_same(username):
    """
    Returns if given user is current user
    """
    current_username = session.get("username")
    if username == current_username:
        return jsonify({"same": True})
    return jsonify({"same": False})

## Subscription Routes
@login_required
@user_bp.route('/user/subscription/<string:streamer_name>')
def user_subscribed(streamer_name: str):
    """
    Checks to see if user is subscribed to another user
    """
    user_id = session.get("user_id")
    subscribed_id = get_user_id(streamer_name)
    if is_subscribed(user_id, subscribed_id):
        return jsonify({"subscribed": True})
    return jsonify({"subscribed": False})

@login_required
@user_bp.route('/user/subscription/<string:streamer_name>/expiration')
def user_subscription_expiration(streamer_name: str):
    """
    Returns remaining time until subscription expiration
    """

    user_id = session.get("user_id")
    subscribed_id = get_user_id(streamer_name)
    remaining_time = subscription_expiration(user_id, subscribed_id)
    # Remove any expired subscriptions from the table
    if remaining_time == 0:
        delete_subscription(user_id, subscribed_id)

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
def user_followed_content():
    """
    Queries DB to get a dict of followed users and categories
    """
    user_id = session.get('user_id')

    streams = get_followed_streamers(user_id)
    categories = get_followed_categories(user_id)
    return jsonify({"streams": streams, "categories": categories})

@login_required
@user_bp.route('/user/category/follow/<string:category_name>')
def user_follow_category(category_name):
    """
    Follows a category
    """
    user_id = session.get("user_id")
    category_id = get_category_id(category_name)
    return follow_category(user_id, category_id)

@login_required
@user_bp.route('/user/category/unfollow/<string:category_name>')
def user_unfollow_category(category_name):
    """
    Unfollows a category
    """
    user_id = session.get("user_id")
    category_id = get_category_id(category_name)
    return unfollow_category(user_id, category_id)

@user_bp.route('/user/category/following/<string:category_name>')
def user_category_following(category_name: str):
    """
    Checks to see if user is following a category
    """
    user_id = session.get("user_id")
    category_id = get_category_id(category_name)
    if is_following_category(user_id, category_id):
        return jsonify({"following": True})
    return jsonify({"following": False})

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

@user_bp.route('/user/forgot_password/<string:email>', methods=['POST'])
def user_forgot_password(email):
    """
    Initializes the function to handle password reset
    """
    send_email(email, lambda: forgot_password_body(email))
    return email

@user_bp.route("/send_newsletter/<string:email>", methods=["POST"])
def send_newsletter(email):
    send_email(email, lambda: newsletter_conf(email))
    return email


@user_bp.route('/user/reset_password/<string:token>/<string:new_password>', methods=['POST'])
def user_reset_password(token, new_password):
    """
    Given token and new password resets the users password
    """
    salt_value = r.get(token)
    if salt_value:
            r.delete(token)

    email = verify_token(token[:-5], salt_value)
    if email:
        reset_password(new_password, email)
        return jsonify({"message": "Password reset successful"}), 200
    return jsonify({"error": "Invalid token"}), 400