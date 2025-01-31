from celery import Celery, shared_task, Task
from utils.stream_utils import generate_thumbnail, streamer_live_status
from time import sleep

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
def update_thumbnail(user_id, sleep_time=10) -> None:
    """
    Updates the thumbnail of a stream periodically
    """
    ffmpeg_wait_time = 5

    # check if user is streaming
    while streamer_live_status(user_id)['isLive']:
        sleep(ffmpeg_wait_time)
        generate_thumbnail(user_id)
        sleep(sleep_time - ffmpeg_wait_time)
    return