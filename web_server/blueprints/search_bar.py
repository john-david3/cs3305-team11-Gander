from flask import Blueprint, jsonify, request
from database.database import Database
from utils.utils import sanitize

search_bp = Blueprint("search", __name__)

def rank_results(query, result):
    """
    Function that ranks results of queries.

    If word is an exact match, return 0 as score,
    If character from search query are in something from the db, return score as 1,
    Else return 2.

    Lower score means better search result.
    """
    # Turn database result into iterative
    charset = iter(result)

    # Assign a score based on the level of the match
    if query in result:
        return 0
    elif all(c in charset for c in query):
        return 1
    return 2

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
    res_dict = []
    categories = db.fetchall("SELECT category_id, category_name FROM categories")
    for c in categories:
        key = c.get("category_name")
        score = rank_results(query.lower(), key.lower())
        c["score"] = score
        if score < 2:
            res_dict.append(c)
    categories = sorted(res_dict, key=lambda d: d["score"])
    categories = categories[:4]
    
    # 3 users
    res_dict = []
    users = db.fetchall("SELECT user_id, username, is_live FROM users")
    for u in users:
        key = u.get("username")
        score = rank_results(query.lower(), key.lower())
        u["score"] = score
        if score < 2:
            res_dict.append(u)
    users = sorted(res_dict, key=lambda d: d["score"])
    users = users[:4]

    # 3 streams    
    res_dict = []
    streams = db.fetchall("""SELECT s.user_id, s.title, s.num_viewers, c.category_name, u.username
                    FROM streams AS s
                    INNER JOIN streams AS f ON s.user_id = f.user_id
                    INNER JOIN users AS u ON s.user_id = u.user_id
                    INNER JOIN categories AS c ON s.category_id = c.category_id
                    """)
    
    for s in streams:
        key = s.get("title")
        score = rank_results(query.lower(), key.lower())
        s["score"] = score
        if score < 2:
            res_dict.append(s)
    streams = sorted(res_dict, key=lambda d: d["score"])
    streams = streams[:4]

    # 3 VODs
    res_dict = []
    vods = db.fetchall("""SELECT v.vod_id, v.title, u.user_id, u.username 
                       FROM vods as v JOIN users as u
                       ON v.user_id = u.user_id""")
    for v in vods:
        key = v.get("title")
        score = rank_results(query.lower(), key.lower())
        v["score"] = score
        if score < 2:
            res_dict.append(v)
    vods = sorted(res_dict, key=lambda d: d["score"])
    vods = vods[:4]

    db.close_connection()

    print(query, streams, users, categories, vods, flush=True)
    
    return jsonify({"streams": streams, "categories": categories, "users": users, "vods": vods})