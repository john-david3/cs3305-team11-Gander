from flask import Flask
from flask_session import Session
from blueprints.utils import logged_in_user
from flask_cors import CORS
import os

print("Environment variables:")
print(f"FLASK_SECRET_KEY: {os.getenv('FLASK_SECRET_KEY')}")
print(f"STRIPE_SECRET_KEY: {os.getenv('STRIPE_SECRET_KEY')}")


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY")
    app.config["SESSION_PERMANENT"] = False
    app.config["SESSION_TYPE"] = "filesystem"
    #! ↓↓↓ For development purposes only
    CORS(app)       # Allow cross-origin requests for the frontend

    Session(app)
    app.before_request(logged_in_user)

    with app.app_context():
        from blueprints.authentication import auth_bp
        from blueprints.main import main_bp
        from blueprints.stripe import stripe_bp

        app.register_blueprint(auth_bp)
        app.register_blueprint(main_bp)
        app.register_blueprint(stripe_bp)

    return app