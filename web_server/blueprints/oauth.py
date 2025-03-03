from os import getenv
from authlib.integrations.flask_client import OAuth, OAuthError
from flask import Blueprint, jsonify, session, redirect, request
from blueprints.user import get_session_info_email
from database.database import Database
from dotenv import load_dotenv
from secrets import token_hex, token_urlsafe
from random import randint

oauth_bp = Blueprint("oauth", __name__)
google = None

load_dotenv()
url_api = getenv("VITE_API_URL")
url = getenv("HOMEPAGE_URL")


def init_oauth(app):
    """
    Initialise the OAuth functionality.
    """
    oauth = OAuth(app)
    global google
    google = oauth.register(
        'google',
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        authorize_url='https://accounts.google.com/o/oauth2/auth',
        access_token_url='https://oauth2.googleapis.com/token',
        client_kwargs={
            'scope': 'openid profile email',
            'prompt': 'select_account'  # Forces account selection even if already logged in
        },
        api_base_url='https://www.googleapis.com/oauth2/v1/',
        userinfo_endpoint='https://openidconnect.googleapis.com/v1/userinfo',
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        redirect_uri=f"{url}/api/google_auth"
    )


@oauth_bp.route('/login/google')
def login_google():
    """
    Redirects to Google's OAuth authorization page
    """
    # Create both nonce and state
    session["nonce"] = token_urlsafe(16)
    session["state"] = token_urlsafe(32)
    session["origin"] = request.args.get("next")
    
    # Make sure session is saved before redirect
    session.modified = True
    
    return google.authorize_redirect(
        redirect_uri=f'{url}/api/google_auth',
        nonce=session['nonce'],
        state=session['state']
    )


@oauth_bp.route('/google_auth')
def google_auth():
    """
    Receives token from Google OAuth and authenticates it to validate login
    """
    try:
        # Check state parameter before authorizing
        returned_state = request.args.get('state')
        stored_state = session.get('state')
        
        if not stored_state or stored_state != returned_state:
            print(f"State mismatch: stored={stored_state}, returned={returned_state}", flush=True)
            return jsonify({
                'error': f"mismatching_state: CSRF Warning! State not equal in request and response.",
                'message': 'Authentication failed'
            }), 400
        
        # State matched, proceed with token authorization
        token = google.authorize_access_token()

        # Verify nonce
        nonce = session.get('nonce')
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
                    username = user.get("given_name") + \
                        str(randint(1, 1000000))
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

        # Store origin, username and user_id before clearing session
        origin = session.get("origin", f"{url.replace('/api', '')}")
        username = user_data["username"]
        user_id = user_data["user_id"]
        
        # Clear session and set new data
        session.clear()
        session["username"] = username
        session["user_id"] = user_id
        
        # Ensure session is saved
        session.modified = True
        
        print(f"session: {session.get('username')}. user_id: {session.get('user_id')}", flush=True)

        return redirect(origin)

    except OAuthError as e:
        print(f"OAuth Error: {str(e)}", flush=True)
        return jsonify({
            'message': 'Authentication failed',
            'error': str(e)
        }), 400

    except Exception as e:
        print(f"Unexpected Error: {str(e)}", flush=True)
        return jsonify({
            'message': 'An unexpected error occurred',
            'error': str(e)
        }), 500