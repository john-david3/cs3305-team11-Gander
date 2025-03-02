from database.database import Database
from typing import Optional
import os, subprocess
from typing import Optional, List
from time import sleep
from utils.path_manager import PathManager

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
            SELECT s.user_id, u.username, s.title, s.start_time, s.num_viewers, c.category_name, c.category_id
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

def get_custom_thumbnail_status(user_id: int) -> Optional[dict]:
    """
    Returns the custom thumbnail status of a streamer
    """
    with Database() as db:
        custom_thumbnail = db.fetchone("""
            SELECT custom_thumbnail 
            FROM users 
            WHERE user_id = ?;
        """, (user_id,))
    return custom_thumbnail

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
        latest_vod = db.fetchone("""SELECT * FROM vods WHERE user_id = ? ORDER BY vod_id DESC;""", (user_id,))
    return latest_vod

def get_user_vods(user_id: int):
    """
    Returns data of all vods by a streamer
    """
    with Database() as db:
        vods = db.fetchall("""SELECT * FROM vods WHERE user_id = ?;""", (user_id,))
    return vods

def get_all_vods():
    """
    Returns data of all VODs by all streamers in a JSON-compatible format
    """
    with Database() as db:
        vods = db.fetchall("""SELECT * FROM vods""")
    return vods

def generate_thumbnail(stream_file: str, thumbnail_file: str) -> None:
    """
    Generates the thumbnail of a stream
    """

    thumbnail_command = [
        "ffmpeg",
        "-y",
        "-i",
        f"{stream_file}",
        "-vframes",
        "1",
        "-q:v",
        "2",
        f"{thumbnail_file}"
    ]

    try:
        subprocess.run(thumbnail_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        print(f"Thumbnail generated for {stream_file}")
    except subprocess.CalledProcessError as e:
        print(f"No information available for {stream_file}, aborting thumbnail generation")

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