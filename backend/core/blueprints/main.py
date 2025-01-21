from flask import render_template, Blueprint

main_bp = Blueprint("app", __name__)


@main_bp.route('/')
def index():
    """
    Home page of the platform
    
    Contains a list of some of the streams that are currently live and the most popular categories.
    """
    return render_template('index.html')

