from flask import Blueprint, render_template, session, request, url_for, redirect, g
from werkzeug.security import generate_password_hash, check_password_hash
from backend.forms import SignupForm, LoginForm
from backend.database.database import Database
from backend.blueprints.utils import login_required

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["GET", "POST"])
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
        cursor = db.create_connection()

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
            cursor.execute("""INSERT INTO users (username, password, email, num_followers, isPartenered, bio)
                       VALUES (?, ?, ?, ?, ?, ?);""", (username, generate_password_hash(password), email, 0, 0, "This user does not have a Bio."))
            db.commit_data()
            return redirect(url_for("auth.login"))


        # Close connection to prevent data leaks
        db.close_connection()

    return render_template("signup.html", form=form)

@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        # Retrieve data from the login form
        username = form.username.data
        password = form.username.data

        # Compare with database
        db = Database()
        cursor = db.create_connection()

        # Check if user exists so only users who have signed up can login
        user_exists = cursor.execute("""SELECT * FROM users
                                  WHERE username = ?;""", (username,)).fetchone()

        if not user_exists:
            form.username.errors.append("Incorrect username or password.")
            db.close_connection()

        # Check is hashed passwords match to verify the user logging in
        elif not check_password_hash(user_exists["password"], password):
            form.username.errors.append("Incorrect username or password.")
            db.close_connection()

        else:
            # Create a new session to prevent users from exploiting horizontal access control
            session.clear()
            session["username"] = username

            # Return to previous page if applicable
            next_page = request.args.get("next")

            # Otherwise return home
            if not next_page:
                next_page = url_for("app.index")
            db.close_connection()
            return redirect(next_page)
        
    return render_template("login.html", form=form)
    
@auth_bp.route("/logout")
@login_required
def logout():
    session.clear()
    return redirect(url_for("index"))