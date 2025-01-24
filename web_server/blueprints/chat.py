from flask import Blueprint, request, jsonify
from blueprints.utils import login_required
from database.database import Database

chat_bp = Blueprint("chat", __name__)

# <---------------------- ROUTES NEEDS TO BE CHANGED TO VIDEO OR DELETED AS DEEMED APPROPRIATE ---------------------->
# TODO: Add a route that deletes all chat logs when the stream is finished

@chat_bp.route("/chat/<int:stream_id>")
def get_past_chat(stream_id):
    """
    Returns a JSON object to be passed to the server.
    
    Output structure in the following format: `{chatter_id: message}` for all chats.

    Ran once when a user first logs into a stream to get the most recent 50 chat messages.
    """

    # Connect to the database
    db = Database()
    cursor = db.create_connection()
    
    # fetched in format: [(chatter_id, message, time_sent)]
    all_chats = cursor.execute("""
                               SELECT *
                               FROM (
                                    SELECT chatter_id, message, time_sent
                                    FROM chat
                                    WHERE stream_id = ?
                                    ORDER BY time_sent DESC
                                    LIMIT 50
                               )
                               ORDER BY time_sent ASC;""", (stream_id,)).fetchall()
    db.close_connection()
    
    # Create JSON output of chat_history to pass through NGINX proxy
    chat_history = [{"chatter_id": chat[0], "message": chat[1], "time_sent": chat[2]} for chat in all_chats]

    # Pass the chat history to the proxy
    return jsonify({"chat_history": chat_history}), 200

@chat_bp.route("/send_chat", methods=["POST"])
@login_required
def send_chat():
    """
    Works with react, takes the chat entered by a logged in user and stores in database
    """

    # Take the message information from frontend
    data = request.get_json()
    chatter_id = data.get("chatter_id")
    stream_id = data.get("stream_id")
    message = data.get("message")

    # Input validation - chatter is logged in, message is not empty, stream exists
    if not all([chatter_id, message, stream_id]):
        return jsonify({"chat_sent": False}), 400
    
    # Save chat information to database so other users can see
    db = Database()
    cursor = db.create_connection()
    cursor.execute("""
                    INSERT INTO chat (chatter_id, stream_id, message)
                    VALUES (?, ?, ?);""", (chatter_id, stream_id, message))
    db.commit_data()
    db.close_connection()

    return jsonify({"chat_sent": True}), 200




@chat_bp.route("/load_new_chat/<int:stream_id>", methods=["GET"])
def get_recent_chat(stream_id):
    """
    Fetch new chat messages on a stream a user has already loaded in to.
    """
    # Get the last received chat to avoid repeating old chats
    last_received = request.args.get("last_received")   # last_received is a time stamp
    if not last_received:
        return jsonify({"error": "last_received timestamp required"}), 400

    # Get the most recent chats from the database
    db = Database()
    cursor = db.create_connection()

    # fetched in format: [(chatter_id, message, time_sent)]
    new_chats = cursor.execute("""
                        SELECT chatter_id, message, time_sent
                        FROM chat
                        WHERE stream_id = ?
                        AND time_sent > ?;""", (stream_id, last_received)).fetchall()
    db.close_connection()

    # Send the new chats to frontend
    chat_data = [{"chatter_id": chat[0], "message": chat[1], "time_sent": chat[2]} for chat in new_chats]
    return jsonify(chat_data), 200