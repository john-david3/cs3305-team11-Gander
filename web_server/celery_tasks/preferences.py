from celery import shared_task
from database.database import Database
import redis
import json

redis_url = "redis://redis:6379/1"
r = redis.from_url(redis_url, decode_responses=True)

@shared_task
def user_preferences():
    """
    Updates users preferences on different stream categories based on the streams they are currently watching
    """
    stats = r.hget("current_viewers", "viewers")
    # If there are any current viewers
    if stats:
        stats = json.loads(stats)
        print(stats, flush=True)
        with Database() as db:
            # Loop over all users and their currently watching streams
            for user_id, stream_ids in stats.items():
                # For each user and stream combination
                for stream_id in stream_ids:
                    # Retrieves category associated with stream
                    current_category = db.fetchone("""SELECT category_id FROM streams
                                                   WHERE user_id = ?
                                                   """, (stream_id))
                    # If stream is still live then update the user_preferences table to reflect their preferences
                    if current_category:
                        db.execute("""INSERT INTO user_preferences (user_id,category_id,favourability)
                                    VALUES (?,?,?)
                                    ON CONFLICT(user_id, category_id) 
                                    DO UPDATE SET favourability = favourability + 1
                                   """, (user_id, current_category["category_id"], 1))
            data = db.fetchall("SELECT * FROM user_preferences")
            print(data,flush=True)