from authlib.integrations.flask_client import OAuth, OAuthError
from flask import Blueprint, url_for, jsonify, session

oauth_bp = Blueprint("oauth", __name__)
def init_oauth(app):
    oauth = OAuth(app)

    google = oauth.register(
        'google',
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        authorize_url='https://accounts.google.com/o/oauth2/auth',
        authorize_params=None,
        access_token_url='https://accounts.google.com/o/oauth2/token',
        access_token_params=None,
        refresh_token_url=None,
        redirect_uri=url_for('google.google_auth', _external=True),
        scope='openid profile email',
    )


    @oauth_bp.route('/login/google')
    def login_google():
            """
            Redirects to Google's OAuth authorization page
            """
            return  google.authorize_redirect(url_for('google.google_auth', _external=True))

    @oauth_bp.route('/google_auth')
    def google_auth():
        try:
            token = google.authorize_access_token()
            user = google.parse_id_token(token)
            
            # check if email exists else create a database entry
            user_email = user.get("email")

            session.clear()
            session["username"] = "a"
            session["user_id"] = 1

            return jsonify({
                'message': 'User authenticated successfully',
            })
        
        except OAuthError as e:
            # Handle OAuth errors like failed authentication or invalid token
            return jsonify({
                'message': 'Authentication failed',
                'error': str(e)
            }), 400 

        except Exception as e:
            # Handle other unexpected errors
            return jsonify({
                'message': 'An unexpected error occurred',
                'error': str(e)
            }), 500 