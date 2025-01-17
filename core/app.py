from flask import Flask, render_template, session, request, url_for, redirect, g
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

from core.forms import SignupForm, LoginForm
from core.database import Database

app = Flask(__name__, template_folder="../ui/templates/")
app.config["SECRET_KEY"] = ""
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.teardown_appcontext(Database.close_connection)
Session(app)

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
    """add at start of routes where admins need to be logged in to access"""
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

        # Store in database and hash to avoid exposing sensitive information
        db = Database()
        cursor = db.create_connection("../database/app.db")

        # Check if user already exists to avoid duplicates
        dup_email = cursor.execute("""SELECT * FROM users
                                    WHERE email = ?;""", (email,)).fetchone()
        dup_username = cursor.execute("""SELECT * FROM users
                                      WHERE username = ?;""", (username,)).fetchone()

        if dup_email is not None:
            form.email.errors.append("Email already taken.")
        elif dup_username is not None:
            form.username.errors.append("Username already taken.")
        elif password != password2:
            form.password.errors.append("Passwords must match.")
        else:
            db.execute("""INSERT INTO users (username, password, email, num_followers, isPartenered, bio)
                       VALUES (?, ?, ?, ?, ?, ?);""", (username, generate_password_hash(password), email, 0, 0, "This user does not have a Bio."))
            db.commit()
            return redirect(url_for("login"))


        # Close connection to prevent data leaks
        db.close_connection()

    return render_template("signup.html", form=form)

@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        # Retrieve data from the login form
        username = form.username.data
        password = form.username.data

        # Compare with database
        db = Database()
        cursor = db.create_connection("../database/app.db")

        # Check if user exists so only users who have signed up can login
        user_exists = cursor.execute("""SELECT * FROM users
                                  WHERE username = ?;""", (username,)).fetchone()
        db.close_connection()

        if not user_exists:
            form.username.errors.append("Incorrect username or password.")

        # Check is hashed passwords match to verify the user logging in
        elif not check_password_hash(user_exists["password"], password):
            form.username.errors.append("Incorrect username or password.")

        else:
            # Create a new session to prevent users from exploiting horizontal access control
            session.clear()
            session["username"] = username

            # Return to previous page if applicable
            next_page = request.args.get("next")

            # Otherwise return home
            if not next_page:
                next_page = url_for("index")
            return redirect(next_page)
        
    return render_template("login.html", form=form)
    
@app.route("/logout")
@login_required
def logout():
    session.clear()
    return redirect(url_for("index"))