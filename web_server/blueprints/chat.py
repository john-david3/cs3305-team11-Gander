from flask import Blueprint
from blueprints.utils import login_required
from database.database import Database

chat_bp = Blueprint("chat", __name__)

@login_required
def chat():
    """
    Works with react, takes the chat entered by a logged in user and stores in database
    """
    

    return {}


def get_all_chat():
    """
    Returns a dictionary to be passed to the server.
    
    Output structure in the following format: `{(chatter, message), ...}` for all chats.

    Rans once when a user first logs into a stream
    """

    # Connect to the database
    db = Database()
    cursor = db.create_connection()
    
    # Returns list of tuples: (chatter_id, message)
    all_chats = cursor.execute("""SELECT ?, ? FROM chat
                                  ORDER BY ?;""", ("chatter_id", "message", "time_sent")).fetchall()
    
    # Create JSON output of chat_history to pass through NGINX proxy
    chat_history = {}
    for chat in all_chats:
        chat_history[chat[0]] = chat[1]

    # Pass the chat history to the proxy
    return chat_history

def get_recent_chat():
    """
    Run periodically to return new chat messages on a stream a user has already loaded in to.
    
    
    """
    return {}