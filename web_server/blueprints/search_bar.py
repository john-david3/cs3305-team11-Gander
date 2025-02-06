from flask import Blueprint, jsonify
from database.database import Database

search_bp = Blueprint("search", __name__)

@search_bp.route("/search/<str:query>", methods=["GET", "POST"])
def search_results(query: str):
    """
    Return the most similar search results

    This is the main route that displays a subsection of each search topic
    """
    # Create the connection to the database
    db = Database()
    db.create_connection()

    # Get the most accurate search results
    # 3 categories
    categories = db.fetchall("""
                SELECT bm25(category_fts), rank, f.category_id, f.category_name
                FROM categorys AS c
                INNER JOIN category_fts AS f ON c.category_id = f.category_id
                WHERE category_fts MATCH ?
                LIMIT 3;
        """, (query,))
    
    # 3 users
    users = db.fetchall("""
                SELECT bm25(user_fts), rank, f.user_id, f.username, f.is_live
                FROM users u
                INNER JOIN user_fts f ON u.user_id = f.user_id
                WHERE user_fts MATCH ?
                LIMIT 3;
        """, (query,))

    # 3 streams
    streams = db.fetchall("""
                SELECT bm25(stream_fts), rank, f.user_id, f.title, f.num_viewers, f.category_id
                FROM streams s
                INNER JOIN stream_fts f ON s.user_id = f.user_id
                WHERE user_fts MATCH ?
                LIMIT 3;
        """, (query,))

    db.close_connection()
    
    return jsonify({"categories": categories, "users": users, "streams": streams})

@search_bp.route("/search/categories/<str:query>", methods=["GET", "POST"])
def search_categories(query: str):
	# Create the connection to the database
    db = Database()
    db.create_connection()

    categories = db.fetchall("""
                SELECT bm25(category_fts), rank, f.category_id, f.category_name
                FROM categorys AS c
                INNER JOIN category_fts AS f ON c.category_id = f.category_id
                WHERE category_fts MATCH ?;
        """, (query,))
    
    db.close_connection()
    
    return jsonify({"categories": categories})

@search_bp.route("/search/users/<str:query>", methods=["GET", "POST"])
def search_users(query: str):
	# Create the connection to the database
    db = Database()
    db.create_connection()
    
    users = db.fetchall("""
                SELECT bm25(user_fts), rank, f.user_id, f.username, f.is_live
                FROM users u
                INNER JOIN user_fts f ON u.user_id = f.user_id
                WHERE user_fts MATCH ?;
        """, (query,))
    
    db.close_connection()

    return jsonify({"users": users})


@search_bp.route("/search/streams/<str:query>", methods=["GET", "POST"])
def search_streams(query: str):
	# Create the connection to the database
    db = Database()
    db.create_connection()
    
    streams = db.fetchall("""
                SELECT bm25(stream_fts), rank, f.user_id, f.title, f.num_viewers, f.category_id
                FROM streams s
                INNER JOIN stream_fts f ON s.user_id = f.user_id
                WHERE user_fts MATCH ?;
        """, (query,))

    db.close_connection()

    return jsonify({"streams": streams})