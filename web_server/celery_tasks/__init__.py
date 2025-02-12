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
def update_thumbnail(stream_file, thumbnail_file, sleep_time) -> None:
    """
    Updates the thumbnail of a stream periodically
    """

    while True:
        generate_thumbnail(stream_file, thumbnail_file)
        sleep(sleep_time)

@shared_task
def combine_ts_stream(stream_path, vods_path):
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
    file_name = datetime.now().strftime("%d-%m-%Y-%H-%M-%S") + ".mp4"
    
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
        f"{vods_path}/{file_name}"
    ]

    subprocess.run(vod_command)

    # Remove ts files
    for ts_file in ts_files:
        remove(f"{stream_path}/{ts_file}")
