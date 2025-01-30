from flask import Blueprint, jsonify, session
from database.database import Database
from flask_socketio import SocketIO, emit, join_room, leave_room
from datetime import datetime
from flask_socketio import SocketIO

chat_bp = Blueprint("chat", __name__)
socketio = SocketIO()

# <---------------------- ROUTES NEEDS TO BE CHANGED TO VIDEO OR DELETED AS DEEMED APPROPRIATE ---------------------->

@socketio.on("connect")
def handle_connection() -> None:
    """
    Accept the connection from the frontend.
    """ 
    print("Client Connected")  # Confirmation connect has been made


@socketio.on("join")
def handle_join(data) -> None:
    """
    Allow a user to join the chat of the stream they are watching.
    """
    stream_id = data.get("stream_id")
    if stream_id:
        join_room(stream_id)
        emit("status", {"message": f"Welcome to the chat, stream_id: {stream_id}"}, room=stream_id)


@socketio.on("leave")
def handle_leave(data) -> None:
    """
    Handle what happens when a user leaves the stream they are watching in regards to the chat.
    """
    stream_id = data.get("stream_id")
    if stream_id:
        leave_room(stream_id)
        emit("status", {"message": f"user left room {stream_id}"}, room=stream_id)


@chat_bp.route("/chat/<int:stream_id>")
def get_past_chat(stream_id: int):
    """
    Returns a JSON object to be passed to the server.

    Output structure in the following format: `{chatter_id: message}` for all chats.

    Ran once when a user first logs into a stream to get the most recent 50 chat messages.
    """

    # Connect to the database
    db = Database()

    # fetched in format: [(chatter_id, message, time_sent)]
    all_chats = db.fetchall("""
                               SELECT *
                               FROM (
                                    SELECT chatter_id, message, time_sent
                                    FROM chat
                                    WHERE stream_id = ?
                                    ORDER BY time_sent DESC
                                    LIMIT 50
                               )
                               ORDER BY time_sent ASC;""", (stream_id,))

    db.close_connection()

    # Create JSON output of chat_history to pass through NGINX proxy
    print(f"Bollocks: {all_chats}", flush=True)
    chat_history = [{"chatter_id": chat["chatter_id"], "message": chat["message"], "time_sent": chat["time_sent"]} for chat in all_chats]
    print(f"chat history: {chat_history}", flush=True)

    # Pass the chat history to the proxy
    return jsonify({"chat_history": chat_history}), 200


@socketio.on("send_message")
def send_chat(data) -> None:
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

    # Send the chat message to the client so it can be displayed
    emit("new_message", {
        "chatter_id": chatter_id,
        "message": message,
        "time_sent": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }, room=stream_id)

    # Asynchronously save the chat
    save_chat(chatter_id, stream_id, message)


def save_chat(chatter_id, stream_id, message):
    """Save the chat to the database"""
    db = Database()
    db.execute("""
                    INSERT INTO chat (chatter_id, stream_id, message)
                    VALUES (?, ?, ?);""", (chatter_id, stream_id, message))
    db.close_connection()
