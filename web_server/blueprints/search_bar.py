from flask import Blueprint, jsonify, request
from database.database import Database
from utils.utils import sanitize

search_bp = Blueprint("search", __name__)

@search_bp.route("/search", methods=["POST"])
def search_results():
    """
    Return the most similar search results

    This is the main route that displays a subsection of each search topic
    """
    data = request.get_json()
    query = sanitize(data["query"])

    # Create the connection to the database
    db = Database()
    db.create_connection()

    # Get the most accurate search results
    # 3 categories
    categories = db.fetchall("""
                    SELECT bm25(category_fts) AS score, c.category_id, c.category_name
                    FROM categories AS c
                    INNER JOIN category_fts AS f ON c.category_id = f.category_id
                    WHERE f.category_name LIKE '%' || ? || '%'
                    ORDER BY score ASC
                    LIMIT 3;
        """, (query,))
    
    # 3 users
    users = db.fetchall("""
                    SELECT bm25(user_fts) AS score, u.user_id, u.username, u.is_live
                    FROM users AS u
                    INNER JOIN user_fts AS f ON u.user_id = f.user_id
                    WHERE f.username LIKE '%' || ? || '%'
                    ORDER BY score ASC
                    LIMIT 3;
        """, (query,))

    # 3 streams
    streams = db.fetchall("""
                    SELECT bm25(stream_fts) AS score, s.user_id, s.title, s.num_viewers, s.category_id
                    FROM streams AS s
                    INNER JOIN stream_fts AS f ON s.user_id = f.user_id
                    WHERE f.title LIKE '%' || ? || '%'
                    ORDER BY score ASC
                    LIMIT 3;
        """, (query,))

    db.close_connection()

    print(query, streams, users, categories, flush=True)
    
    return jsonify({"categories": categories, "users": users, "streams": streams})

@search_bp.route("/search/categories/<string:query>", methods=["GET", "POST"])
def search_categories(query: str):
	# Create the connection to the database
    db = Database()
    db.create_connection()

    categories = db.fetchall("""
                SELECT bm25(category_fts), rank, f.category_id, f.category_name
                FROM categories AS c
                INNER JOIN category_fts AS f ON c.category_id = f.category_id
                WHERE category_fts MATCH ?;
        """, (query,))
    
    db.close_connection()
    
    return jsonify({"categories": categories})

@search_bp.route("/search/users/<string:query>", methods=["GET", "POST"])
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


@search_bp.route("/search/streams/<string:query>", methods=["GET", "POST"])
def search_streams(query: str):
	# Create the connection to the database
    db = Database()
    db.create_connection()
    
    streams = db.fetchall("""
                SELECT bm25(stream_fts), rank, f.user_id, f.title, f.num_viewers, f.category_id
                FROM streams s
                INNER JOIN stream_fts f ON s.user_id = f.user_id
                WHERE stream_fts MATCH ?;
        """, (query,))

    db.close_connection()

    return jsonify({"streams": streams})