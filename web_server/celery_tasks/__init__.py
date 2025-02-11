from celery import Celery, shared_task, Task
from utils.stream_utils import generate_thumbnail, get_streamer_live_status
from time import sleep
from os import listdir, remove
from datetime import datetime
import subprocess

def celery_init_app(app) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object(app.config["CELERY"])
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app

@shared_task
def update_thumbnail(user_id, sleep_time=180) -> None:
    """
    Updates the thumbnail of a stream periodically
    """
    generate_thumbnail(user_id)
    sleep(sleep_time)

@shared_task
def combine_ts_stream(username):
    """
    Combines all ts files into a single vod, and removes the ts files
    """
    path = f"stream_data/hls/{username}/"
    ts_files = [f for f in listdir(path) if f.endswith(".ts")]
    ts_files.sort()

    # Create temp file listing all ts files
    with open(f"{path}list.txt", "w") as f:
        for ts_file in ts_files:
            f.write(f"file '{ts_file}'\n")
    
    # Concatenate all ts files into a single vod
    file_name = datetime.now().strftime("%d-%m-%Y-%H-%M-%S")
    vod_path = f"stream_data/hls/{username}/{file_name}.mp4"
    vod_command = [
        "ffmpeg",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        f"{path}list.txt",
        "-c",
        "copy",
        vod_path
    ]

    subprocess.run(vod_command)

    # Remove ts files
    for ts_file in ts_files:
        remove(f"{path}{ts_file}")

    return vod_path
