from flask import Flask, render_template, session, request, url_for, redirect, g
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from forms import SignupForm, LoginForm

app = Flask(__name__, template_folder="../ui/templates/")
app.config["SECRET_KEY"] = "j9573-4952-9029-1034"

@app.before_request
def logged_in_user():
    g.user = session.get("username", None)
    g.admin = session.get("username", None)

def login_required(view):
    """add at start of routes where users need to be logged in to access"""
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.user is None:
            return redirect(url_for("login", next=request.url))
        return view(*args, **kwargs)
    return wrapped_view

def admin_required(view):
    """add at start of routes where users admin needs to be logged in to access"""
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.admin != "admin":
            return redirect(url_for("login", next=request.url))
        return view(*args, **kwargs)
    return wrapped_view

@app.route('/')
def index():
    """
    Home page of the platform
    
    Contains a list of some of the streams that are currently live and the most popular categories.
    """

    return render_template('index.html')

@app.route("/signup", methods=["GET", "POST"])
def signup():
    form = SignupForm()
    if form.validate_on_submit():
        # Retrieve data from the sign up form
        username = form.username.data
        email = form.email.data
        password = form.password.data
        password2 = form.password2.data

        # Store in database
    return

@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        # Retrieve data from the login form
        username = form.username.data
        password = form.username.data

        # Compare with database
    return

if __name__ == '__main__':
    app.run(debug=True)