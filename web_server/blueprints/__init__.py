from flask import Flask
# from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_session import Session
from blueprints.utils import logged_in_user
from flask_cors import CORS
import os

# csrf = CSRFProtect()


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY")
    app.config["SESSION_PERMANENT"] = False
    app.config["SESSION_TYPE"] = "filesystem"
    #! ↓↓↓ For development purposes only - Allow cross-origin requests for the frontend
    CORS(app, supports_credentials=True)
    # csrf.init_app(app)

    Session(app)
    app.before_request(logged_in_user)

    # @app.route('/csrf-token')
    # def get_csrf_token():
    #     return jsonify({'csrf_token': generate_csrf()}), 200

    with app.app_context():
        from blueprints.authentication import auth_bp
        from blueprints.main import main_bp
        from blueprints.stripe import stripe_bp
        from blueprints.user import user_bp
        from blueprints.streams import stream_bp
        from blueprints.chat import chat_bp, socketio

        # Registering Blueprints
        app.register_blueprint(auth_bp)
        app.register_blueprint(main_bp)
        app.register_blueprint(stripe_bp)
        app.register_blueprint(user_bp)
        app.register_blueprint(stream_bp)
        app.register_blueprint(chat_bp)

        # Tell sockets where the initialisation app is
        socketio.init_app(app, cors_allowed_origins="*")

    return app
