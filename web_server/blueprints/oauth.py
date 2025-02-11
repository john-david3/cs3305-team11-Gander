from authlib.integrations.flask_client import OAuth, OAuthError
from flask import Blueprint, jsonify, session, redirect
from blueprints.user import get_session_info_email
from database.database import Database
from secrets import token_hex, token_urlsafe
from random import randint

oauth_bp = Blueprint("oauth", __name__)
google = None

def init_oauth(app):
    oauth = OAuth(app)
    global google
    google = oauth.register(
        'google',
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        authorize_url='https://accounts.google.com/o/oauth2/auth',
        access_token_url='https://oauth2.googleapis.com/token',
        client_kwargs={'scope': 'openid profile email'},
        api_base_url='https://www.googleapis.com/oauth2/v1/',
        userinfo_endpoint='https://openidconnect.googleapis.com/v1/userinfo',
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        redirect_uri="http://127.0.0.1:8080/api/google_auth"
    )

@oauth_bp.route('/login/google')
def login_google():
    """
    Redirects to Google's OAuth authorization page
    """
    # Creates nonce to be sent
    session["nonce"] = token_urlsafe(16)
    return google.authorize_redirect(
        'http://127.0.0.1:8080/api/google_auth',
        nonce=session['nonce']
    )

@oauth_bp.route('/google_auth')
def google_auth():
    """
    Receives token from Google OAuth and authenticates it to validate login
    """
    try:
        token = google.authorize_access_token()

        # Verifies token as well as nonce
        nonce = session.pop('nonce', None)
        if not nonce:
            return jsonify({'error': 'Missing nonce in session'}), 400

        user = google.parse_id_token(token, nonce=nonce)
        print(user, flush=True)

        # Check if email exists to login else create a database entry
        user_email = user.get("email")

        user_data = get_session_info_email(user_email)

        if not user_data:
            with Database() as db:
                # Generates a new username for the user
                for _ in range(1000000):
                    username = user.get("given_name") + str(randint(1, 1000000))
                    taken = db.fetchone("""
                        SELECT * FROM users
                        WHERE username = ?
                    """, (username,))
                    
                    if not taken:
                        break

                db.execute(
                    """INSERT INTO users 
                    (username, email, stream_key)
                    VALUES (?, ?, ?)""",
                    (
                        username,
                        user_email,
                        token_hex(32),
                    )
                )
            user_data = get_session_info_email(user_email)

        session.clear()
        session["username"] = user_data["username"]
        session["user_id"] = user_data["user_id"]

        # TODO: redirect back to original page user started on, or other pages based on success failure of login
        return redirect("http://127.0.0.1:8080/")

    except OAuthError as e:
        return jsonify({
            'message': 'Authentication failed',
            'error': str(e)
        }), 400

    except Exception as e:
        return jsonify({
            'message': 'An unexpected error occurred',
            'error': str(e)
        }), 500
