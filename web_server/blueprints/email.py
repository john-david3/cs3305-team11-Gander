from flask import Blueprint, session
from database.db_context import get_db
import smtplib
from email.mime.text import MIMEText
from os import getenv
from random import randrange

email_bp = Blueprint("email", __name__)

@email_bp.route("/send_email", methods=["POST"])
def send_email() -> None:
    """
    Send a verification email to the user.
    """
    # Setup the sender email details
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    SMTP_EMAIL = ""
    SMTP_PASSWORD = getenv()

    # Get the users email address
    db = get_db()
    db.create_connection()
    user_email = db.fetchone("""
                SELECT email
                FROM users
                WHERE username = ?;
            """, (session.get("username"),))


    # Setup up the receiver details
    login_code = randrange(100000, 1000000)
    body = f"Here is your login code: {login_code}" # Make this better
    msg = MIMEText(body)
    msg["Subject"] = "Your Gander Login Code"
    msg["From"] = SMTP_EMAIL
    msg["To"] = user_email

    # Send the email using smtplib
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as smtp:
        try:
            smtp.starttls()     # TLS handshake to start the connection
            smtp.login(SMTP_EMAIL, SMTP_PASSWORD)
            smtp.ehlo()
            smtp.send_message(msg)
        
        except TimeoutError:
            print("Server timed out")

        except Exception as e:
            print("Error: ", e)