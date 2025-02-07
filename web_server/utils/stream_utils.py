from database.database import Database
from typing import Optional
import sqlite3, os, subprocess
from time import sleep
from typing import Optional, List
from datetime import datetime

def get_streamer_live_status(user_id: int):
    """
    Returns boolean on whether the given streamer is live
    """
    with Database() as db:
        is_live = db.fetchone("""
            SELECT is_live 
            FROM users 
            WHERE user_id = ?;
        """, (user_id,))

    return is_live

def get_followed_live_streams(user_id: int) -> Optional[List[dict]]:
    """
    Searches for streamers who the user followed which are currently live
    Returns a list of live streams with the streamer's user id, stream title, and number of viewers
    """
    with Database() as db:
        live_streams = db.fetchall("""
                                    SELECT users.user_id, streams.title, streams.num_viewers, users.username
                                    FROM streams JOIN users 
                                    ON streams.user_id = users.user_id
                                    WHERE users.user_id IN
                                    (SELECT followed_id FROM follows WHERE user_id = ?)
                                    AND users.is_live = 1;
                                """, (user_id,))
    return live_streams

def get_current_stream_data(user_id: int) -> Optional[dict]:
    """
    Returns data of the most recent stream by a streamer
    """
    with Database() as db:
        most_recent_stream = db.fetchone("""
            SELECT s.user_id, u.username, s.title, s.start_time, s.num_viewers, c.category_name
            FROM streams AS s
            JOIN categories AS c ON s.category_id = c.category_id
            JOIN users AS u ON s.user_id = u.user_id
            WHERE u.user_id = ?
        """, (user_id,))
    return most_recent_stream

def get_category_id(category_name: str) -> Optional[int]:
    """
    Returns the category_id given a category name
    """
    with Database() as db:
        data = db.fetchone("""
            SELECT category_id 
            FROM categories 
            WHERE category_name = ?;
        """, (category_name,))
    return data['category_id'] if data else None

def get_vod(vod_id: int) -> dict:
    """
    Returns data of a streamers vod
    """
    with Database() as db:
        vod = db.fetchone("""SELECT * FROM vods WHERE vod_id = ?;""", (vod_id,))
    return vod

def get_latest_vod(user_id: int):
    """
    Returns data of the most recent stream by a streamer
    """
    with Database() as db:
        latest_vod = db.fetchone("""SELECT * FROM vods WHERE user_id = ? ORDER BY vod_id DESC LIMIT 1;""", (user_id,))
    return latest_vod

def get_user_vods(user_id: int):
    """
    Returns data of all vods by a streamer
    """
    with Database() as db:
        vods = db.fetchall("""SELECT * FROM vods WHERE user_id = ?;""", (user_id,))
    return vods


def generate_thumbnail(user_id: int) -> None:
    """
    Generates the thumbnail of a stream
    """
    with Database() as db:
        username = db.fetchone("""SELECT * FROM users WHERE user_id = ?""", (user_id,))

    if not username:
        return None
    
    if not os.path.exists(f"stream_data/thumbnails/"):
        os.makedirs(f"stream_data/thumbnails/")
    
    thumbnail_command = [
        "ffmpeg",
        "-y",
        "-i",
        f"stream_data/hls/{username['username']}/index.m3u8",
        "-vframes",
        "1",
        "-q:v",
        "2",
        f"stream_data/thumbnails/{username['username']}.jpg"
    ]

    subprocess.run(thumbnail_command)

def get_stream_tags(user_id: int) -> Optional[List[str]]:
    """
    Given a stream return tags associated with the user's stream
    """
    with Database() as db:
        tags = db.fetchall("""
            SELECT tag_name 
            FROM tags
            JOIN stream_tags ON tags.tag_id = stream_tags.tag_id
            WHERE user_id = ?;    
        """, (user_id,))
    return tags

def get_vod_tags(vod_id: int):
    """
    Given a vod return tags associated with the vod
    """
    with Database() as db:
        tags = db.fetchall("""
            SELECT tag_name 
            FROM tags
            JOIN vod_tags ON tags.tag_id = vod_tags.tag_id
            WHERE vod_id = ?;    
        """, (vod_id,))
    return tags

def transfer_stream_to_vod(user_id: int):
    """
    Deletes stream from stream table and moves it to VoD table
    TODO: Add functionaliy to save stream permanently
    """

    with Database() as db:
        stream = db.fetchone("""
            SELECT * FROM streams WHERE user_id = ?;
        """, (user_id,))

        if not stream:
            return None
        
        ## TODO: calculate length in seconds, currently using temp value

        db.execute("""
            INSERT INTO vods (user_id, title, datetime, category_id, length, views)
            VALUES (?, ?, ?, ?, ?, ?);
        """, (stream["user_id"], stream["title"], stream["datetime"], stream["category_id"], 10, stream["num_viewers"]))

        db.execute("""
            DELETE FROM streams WHERE user_id = ?;
        """, (user_id,))
    
    return True