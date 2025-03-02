from celery import Celery, shared_task, Task

def celery_init_app(app) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object(app.config["CELERY"])
    celery_app.conf.beat_schedule = {
        'user-favourability-task': {
            'task': 'celery_tasks.preferences.user_preferences',
            'schedule': 30.0,
        },
    }
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app
