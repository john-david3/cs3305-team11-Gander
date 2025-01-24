from flask import Blueprint, jsonify, session
from database.database import Database
from datetime import datetime

user_bp = Blueprint("user", __name__)

@user_bp.route('/is_subscribed/<int:user_id>/<int:streamer_id>', methods=['GET'])
def user_subscribed(user_id, streamer_id):
    """
    Checks to see if user is subscribed to a streamer
    """
    db = Database()
    cursor = db.create_connection()
    data = cursor.execute("SELECT * FROM subscribes WHERE user_id = ? AND streamer_id = ? AND expires > since", (user_id, streamer_id)).fetchone()
    if data:
        return jsonify({"subscribed": True})
    return jsonify({"subscribed": False})

@user_bp.route('/is_following/<int:user_id>/<int:streamer_id>', methods=['GET'])
def user_following(user_id, streamer_id):
    """
    Checks to see if user is following a streamer
    """
    db = Database()
    cursor = db.create_connection()
    data = cursor.execute("SELECT * FROM follows WHERE user_id = ? AND streamer_id = ?", (user_id, streamer_id)).fetchone()
    if data:
        return jsonify({"following": True})
    return jsonify({"following": False})       


@user_bp.route('/subscription_remaining/<int:user_id>/<int:streamer_id>', methods=['GET'])
def user_subscription_expiration(user_id, streamer_id):
    """
    Returns remaining time until subscription expiration
    """
    db = Database()
    cursor = db.create_connection()
    data = cursor.execute("SELECT expires from subscriptions WHERE user_id = ? AND streamer_id = ? AND expires > since", (user_id,streamer_id))
    if data:
        expiration_date = data[0]

        ends_datetime = datetime.strptime(expiration_date, '%Y-%m-%d %H:%M:%S')

        remaining_time = ends_datetime - datetime.now()
        
        return jsonify({"remaining_time": remaining_time.seconds})
    
    return jsonify({"remaining_time": 0})

@user_bp.route('/get_login_status')
def get_login_status():
    """
    Returns whether the user is logged in or not
    """
    username = session.get("username", None)
    if not username:
        return {"logged_in": True}
    return {"logged_in": False}

@user_bp.route('/authenticate_user')
def authenticate_user():
    """
    Authenticates the user
    """
    return {"authenticated": True}
