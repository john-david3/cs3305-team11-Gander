from celery import Celery, shared_task, Task
from datetime import datetime
from celery_tasks.preferences import user_preferences
from utils.stream_utils import generate_thumbnail, get_streamer_live_status, get_custom_thumbnail_status, remove_hls_files
from time import sleep
from os import listdir, remove
from utils.path_manager import PathManager
import subprocess

path_manager = PathManager()

@shared_task
def update_thumbnail(user_id, stream_file, thumbnail_file, sleep_time) -> None:
    """
    Updates the thumbnail of a stream periodically
    """

    # Check if stream is still live and custom thumbnail has not been set
    if get_streamer_live_status(user_id)['is_live'] and not get_custom_thumbnail_status(user_id)['custom_thumbnail']:
        print("Updating thumbnail...")
        generate_thumbnail(stream_file, thumbnail_file)
        update_thumbnail.apply_async((user_id, stream_file, thumbnail_file, sleep_time), countdown=sleep_time)
    else:
        print(f"Stopping thumbnail updates for stream of {user_id}")

@shared_task
def combine_ts_stream(stream_path, vods_path, vod_file_name, thumbnail_file) -> None:
    """
    Combines all ts files into a single vod, and removes the ts files
    """
    ts_files = [f for f in listdir(stream_path) if f.endswith(".ts")]
    ts_files.sort()

    # Create temp file listing all ts files
    with open(f"{stream_path}/list.txt", "w") as f:
        for ts_file in ts_files:
            f.write(f"file '{ts_file}'\n")
    
    # Concatenate all ts files into a single vod
    
    vod_command = [
        "ffmpeg",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        f"{stream_path}/list.txt",
        "-c",
        "copy",
        f"{vods_path}/{vod_file_name}.mp4"
    ]

    subprocess.run(vod_command)

    # Remove HLS files, even if user is not streaming
    remove_hls_files(stream_path)

    # Generate thumbnail for vod
    generate_thumbnail(f"{vods_path}/{vod_file_name}.mp4", thumbnail_file)

@shared_task
def convert_image_to_png(image_path, png_path):
    """
    Converts an image to a png
    """
    image_command = [
        "ffmpeg",
        "-y",
        "-i",
        image_path,
        png_path
    ]

    subprocess.run(image_command)