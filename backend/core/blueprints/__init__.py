from flask import Flask
from flask_session import Session
from core.blueprints.utils import logged_in_user

def create_app():
    app = Flask(__name__, template_folder="../../ui/templates/", static_folder="../../ui/static")
    app.config["SECRET_KEY"] = ""
    app.config["SESSION_PERMANENT"] = False
    app.config["SESSION_TYPE"] = "filesystem"

    Session(app)
    app.before_request(logged_in_user)

    with app.app_context():
        from core.blueprints.authentication import auth_bp
        from core.blueprints.main import main_bp
        from core.blueprints.stripe import stripe_bp

        app.register_blueprint(auth_bp)
        app.register_blueprint(main_bp)
        app.register_blueprint(stripe_bp)

    return app