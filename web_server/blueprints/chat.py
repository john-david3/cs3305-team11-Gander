from flask import Blueprint, jsonify, session
from database.database import Database
from .socket import socketio
from flask_socketio import emit, join_room, leave_room
from datetime import datetime
from utils.user_utils import get_user_id

chat_bp = Blueprint("chat", __name__)

# <---------------------- ROUTES NEEDS TO BE CHANGED TO VIDEO OR DELETED AS DEEMED APPROPRIATE ---------------------->

@socketio.on("connect")
def handle_connection() -> None:
    """
    Accept the connection from the frontend.
    """
    print("\nClient Connected to Chat\n")  # Confirmation connect has been made


@socketio.on("join")
def handle_join(data) -> None:
    """
    Allow a user to join the chat of the stream they are watching.
    """
    stream_id = data.get("stream_id")
    if stream_id:
        join_room(stream_id)
        num_viewers = len(list(socketio.server.manager.get_participants("/", stream_id)))
        emit("status", 
            {
                "message": f"Welcome to the chat, stream_id: {stream_id}",
                "num_viewers": num_viewers
            },
            room=stream_id)


@socketio.on("leave")
def handle_leave(data) -> None:
    """
    Handle what happens when a user leaves the stream they are watching in regards to the chat.
    """
    stream_id = data.get("stream_id")
    if stream_id:
        leave_room(stream_id)
        num_viewers = len(list(socketio.server.manager.get_participants("/", stream_id)))
        emit("status", 
            {
                "message": f"Welcome to the chat, stream_id: {stream_id}",
                "num_viewers": num_viewers
            },
            room=stream_id)


@chat_bp.route("/chat/<int:stream_id>")
def get_past_chat(stream_id: int):
    """
    Returns a JSON object to be passed to the server.

    Output structure in the following format: `{chatter_id: message}` for all chats.

    Ran once when a user first logs into a stream to get the most recent 50 chat messages.
    """

    # Connect to the database
    db = Database()

    # fetched in format: [(username, message, time_sent)]
    all_chats = db.fetchall("""
                            SELECT username, message, time_sent
                            FROM chat
                            JOIN users ON chat.chatter_id = users.user_id
                            WHERE stream_id = ?
                            ORDER BY time_sent ASC
                            LIMIT 50;
                            """, (stream_id,))

    db.close_connection()

    # Create JSON output of chat_history to pass through NGINX proxy
    chat_history = [{"chatter_username": chat["username"], "message": chat["message"], "time_sent": chat["time_sent"]} for chat in all_chats]

    # Pass the chat history to the proxy
    return jsonify({"chat_history": chat_history}), 200


@socketio.on("send_message")
def send_chat(data) -> None:
    """
    Using WebSockets to send a chat message to the specified chat
    """

    # Take the message information from frontend
    chatter_name = data.get("username")
    stream_id = data.get("stream_id")
    message = data.get("message")

    # Input validation - chatter is logged in, message is not empty, stream exists
    if not all([chatter_name, message, stream_id]):
        emit("error", {"error": f"Unable to send a chat. The following info was given: chatter_name={chatter_name}, message={message}, stream_id={stream_id}"}, broadcast=False)
        return

    # Send the chat message to the client so it can be displayed
    emit("new_message", {
        "chatter_username": chatter_name,
        "message": message,
        "time_sent": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }, room=stream_id)

    # Asynchronously save the chat
    save_chat(get_user_id(chatter_name), stream_id, message)


def save_chat(chatter_id, stream_id, message):
    """Save the chat to the database"""
    print(f"Saving to database: {chatter_id}, {stream_id}, {message}")
    db = Database()
    db.execute("""
                    INSERT INTO chat (chatter_id, stream_id, message)
                    VALUES (?, ?, ?);""", (chatter_id, stream_id, message))
    db.close_connection()
