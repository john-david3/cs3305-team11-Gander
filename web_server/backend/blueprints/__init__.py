from flask import Flask
from flask_session import Session
from backend.blueprints.utils import logged_in_user
from flask_cors import CORS

def create_app():
    app = Flask(__name__, template_folder="../ui/templates/", static_folder="../ui/static/")
    app.config["SECRET_KEY"] = ""
    app.config["SESSION_PERMANENT"] = False
    app.config["SESSION_TYPE"] = "filesystem"
    #! ↓↓↓ For development purposes only
    CORS(app)       # Allow cross-origin requests for the frontend

    Session(app)
    app.before_request(logged_in_user)

    with app.app_context():
        from backend.blueprints.authentication import auth_bp
        from backend.blueprints.main import main_bp
        from backend.blueprints.stripe import stripe_bp

        app.register_blueprint(auth_bp)
        app.register_blueprint(main_bp)
        app.register_blueprint(stripe_bp)

    return app