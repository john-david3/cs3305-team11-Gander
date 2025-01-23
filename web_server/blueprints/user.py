from flask import Blueprint

user_bp = Blueprint("stream", __name__)

@user_bp.route('/is_subscribed/<int:user_id>/<int:streamer_id>', methods=['GET'])
def user_subscribed(user_id, streamer_id):
    """
    Checks to see if user is subscribed to a streamer
    """
    return

@user_bp.route('/is_following/<int:user_id>/<int:streamer_id>', methods=['GET'])
def user_following(user_id, streamer_id):
    """
    Checks to see if user is following a streamer
    """
    return
