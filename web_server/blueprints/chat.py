from flask import Blueprint, jsonify
from database.database import Database
from .socket import socketio
from flask_socketio import emit, join_room, leave_room
from datetime import datetime
from utils.user_utils import get_user_id
import redis
import json

redis_url = "redis://redis:6379/1"
r = redis.from_url(redis_url, decode_responses=True)
chat_bp = Blueprint("chat", __name__)

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
    print(data, flush=True)
    stream_id = data.get("stream_id")
    if stream_id:
        user_id = get_user_id(data["username"])
        if user_id:
            add_favourability_entry(str(user_id), str(stream_id))
        join_room(stream_id)
        num_viewers = len(list(socketio.server.manager.get_participants("/", stream_id)))
        update_viewers(stream_id, num_viewers)
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
    print(data, flush=True)
    stream_id = data.get("stream_id")
    user_id = data.get("user_id")
    if stream_id:
        leave_room(stream_id)
        if user_id:
            remove_favourability_entry(data["user_id"], stream_id)
        num_viewers = len(list(socketio.server.manager.get_participants("/", stream_id)))
        update_viewers(stream_id, num_viewers)
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

    # fetched in format: [(username, message, time_sent, is_subscribed)]
    all_chats = db.fetchall("""
                            SELECT 
                                u.username, 
                                c.message, 
                                c.time_sent,
                                CASE
                                    WHEN s.user_id IS NOT NULL AND s.expires > CURRENT_TIMESTAMP THEN 1
                                    ELSE 0
                                END AS is_subscribed
                            FROM chat c
                            JOIN users u ON c.chatter_id = u.user_id
                            LEFT JOIN subscribes s ON c.chatter_id = s.user_id AND s.subscribed_id = ?
                            WHERE c.stream_id = ?
                            ORDER BY c.time_sent ASC
                            LIMIT 50;
                            """, (stream_id, stream_id))

    db.close_connection()

    # Create JSON output of chat_history to pass through NGINX proxy
    chat_history = [{"chatter_username": chat["username"], 
                    "message": chat["message"], 
                    "time_sent": chat["time_sent"],
                    "is_subscribed": bool(chat["is_subscribed"])} for chat in all_chats]
    print(chat_history)

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

def update_viewers(user_id, num_viewers):
    """
        Live Update the number of viewers in the stream to be
        displayed in the homepage or discovery pages
    """
    db = Database()
    db.execute("""
                UPDATE streams
                SET num_viewers = ?
                WHERE user_id = ?;
                """, (num_viewers, user_id))
    db.close_connection
    
#TODO: Make sure that users entry within Redis is removed if they disconnect from socket
def add_favourability_entry(user_id, stream_id):
    """
    Adds entry to Redis that user is watching a streamer
    """
    current_viewers = r.hget("current_viewers", "viewers")

    if current_viewers:
        current_viewers = json.loads(current_viewers)
    else:
        current_viewers = {}


    # Checks if user exists already
    if user_id in current_viewers:
        # If already exists append stream to user
        current_viewers[user_id].append(stream_id)
    else:
        # Creates new entry for user and stream
        current_viewers[user_id] = [stream_id]
    
    r.hset("current_viewers", "viewers", json.dumps(current_viewers))

def remove_favourability_entry(user_id, stream_id):
    """
    Removes entry to Redis that user is watching a streamer
    """
    current_viewers = r.hget("current_viewers", "viewers")

    # If key exists
    if current_viewers:
        current_viewers = json.loads(current_viewers)
    else:
        current_viewers = {}

    # Checks if user exists already
    if user_id in current_viewers:
        # Removes specific stream from user
        current_viewers[user_id] = [stream for stream in current_viewers[user_id] if stream != stream_id]
        
        # If user is no longer watching any streams
        if not current_viewers[user_id]:
            del current_viewers[user_id]

        r.hset("current_viewers", "viewers", json.dumps(current_viewers))