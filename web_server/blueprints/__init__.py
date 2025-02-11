from flask import Flask
from flask_session import Session
from flask_cors import CORS
from blueprints.middleware import logged_in_user, register_error_handlers
# from flask_wtf.csrf import CSRFProtect, generate_csrf

from blueprints.authentication import auth_bp
from blueprints.stripe import stripe_bp
from blueprints.user import user_bp
from blueprints.streams import stream_bp
from blueprints.chat import chat_bp
from blueprints.oauth import oauth_bp, init_oauth
from blueprints.socket import socketio
from celery import Celery
from celery_tasks import celery_init_app#
from blueprints.search_bar import search_bp

from os import getenv

# csrf = CSRFProtect()

def create_app():
    """
        Set up the flask app by registering all the blueprints and configuring
        the settings. Also create a CSRF token to prevent Cross-site Request Forgery.
        And setup web sockets to be used throughout the project.
    """
    app = Flask(__name__)
    app.config["SERVER_NAME"] = "127.0.0.1:8080"
    app.config["SECRET_KEY"] = getenv("FLASK_SECRET_KEY")
    app.config["SESSION_PERMANENT"] = False
    app.config["SESSION_TYPE"] = "filesystem"
    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config['GOOGLE_CLIENT_ID'] = getenv("GOOGLE_CLIENT_ID")
    app.config['GOOGLE_CLIENT_SECRET'] = getenv("GOOGLE_CLIENT_SECRET")

    app.config.from_mapping(
    CELERY=dict(
        broker_url="redis://redis:6379/0",
        result_backend="redis://redis:6379/0",
        task_ignore_result=True,
        ),
    )
    app.config.from_prefixed_env()
    celery = celery_init_app(app)

    #! ↓↓↓ For development purposes only - Allow cross-origin requests for the frontend
    CORS(app, supports_credentials=True)
    # csrf.init_app(app)

    socketio.init_app(app)
    
    Session(app)
    app.before_request(logged_in_user)
    init_oauth(app)

    # adds in error handlers
    register_error_handlers(app)

    # @app.route('/csrf-token')
    # def get_csrf_token():
    #     return jsonify({'csrf_token': generate_csrf()}), 200

    with app.app_context():

        # Registering Blueprints
        app.register_blueprint(auth_bp)
        app.register_blueprint(stripe_bp)
        app.register_blueprint(user_bp)
        app.register_blueprint(stream_bp)
        app.register_blueprint(chat_bp)
        app.register_blueprint(oauth_bp)
        app.register_blueprint(search_bp)

        socketio.init_app(app)

    return app
