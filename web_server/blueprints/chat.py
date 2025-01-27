from flask import Blueprint, request, jsonify, session
from blueprints.utils import login_required
from database.database import Database
from flask_socketio import SocketIO, emit, join_room, leave_room
from datetime import datetime

chat_bp = Blueprint("chat", __name__)
socketio = SocketIO()

# <---------------------- ROUTES NEEDS TO BE CHANGED TO VIDEO OR DELETED AS DEEMED APPROPRIATE ---------------------->
# TODO: Add a route that deletes all chat logs when the stream is finished

@socketio.on("connect")
def handle_connection():
    print("Client Connected")

@socketio.on("join")
def handle_join(data):
    """
    Allow a user to join the chat of the stream they are watching.
    """
    stream_id = data.get("stream_id")
    if stream_id:
        join_room(stream_id)
        emit("status", {"message": f"Welcome to the chat, stream_id: {stream_id}"}, room=stream_id)

@socketio.on("leave")
def handle_leave(data):
    """
    Handle what happens when a user leaves the stream they are watching in regards to the chat.
    """
    stream_id = data.get("stream_id")
    if stream_id:
        leave_room(stream_id)
        emit("status", {"message": f"user left room {stream_id}"}, room=stream_id)

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

@socketio.on("send_message")
def send_chat(data):
    """
    Using WebSockets to send a chat message to the specified chat
    """

    # Take the message information from frontend
    chatter_id = session.get("username")
    stream_id = data.get("stream_id")
    message = data.get("message")

    # Input validation - chatter is logged in, message is not empty, stream exists
    if not all([chatter_id, message, stream_id]):
        emit("error", {"error": "Unable to send a chat"}, broadcast=False)
        return
    
    # Save chat information to database so other users can see
    db = Database()
    cursor = db.create_connection()
    cursor.execute("""
                    INSERT INTO chat (chatter_id, stream_id, message)
                    VALUES (?, ?, ?);""", (chatter_id, stream_id, message))
    db.commit_data()
    db.close_connection()

    emit("new_message", {
        "chatter_id":chatter_id,
        "message":message,
        "time_sent": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }, room=stream_id)