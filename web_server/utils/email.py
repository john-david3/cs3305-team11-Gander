import smtplib
from email.mime.text import MIMEText

from os import getenv
from dotenv import load_dotenv
from utils.auth import generate_token
from secrets import token_hex
from .user_utils import get_session_info_email
import redis

redis_url = "redis://redis:6379/1"
r = redis.from_url(redis_url, decode_responses=True)

load_dotenv()

url = getenv("HOMEPAGE_URL")


def send_email(email, func) -> None:
    """
    Send a verification email to the user.
    """

    # Setup the sender email details
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    SMTP_EMAIL = getenv("EMAIL")
    SMTP_PASSWORD = getenv("EMAIL_PASSWORD")

    # Setup up the receiver details
    body = func()

    msg = MIMEText(body, "html")
    msg["Subject"] = "Reset Gander Login"
    msg["From"] = SMTP_EMAIL
    msg["To"] = email

    # Send the email using smtplib
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as smtp:
        try:
            smtp.starttls()     # TLS handshake to start the connection
            smtp.login(SMTP_EMAIL, SMTP_PASSWORD)
            smtp.ehlo()
            smtp.send_message(msg)
        
        except TimeoutError:
            print("Server timed out", flush=True)

        except Exception as e:
            print("Error: ", e, flush=True)

def forgot_password_body(email) -> str:
    """
    Handles the creation of the email body for resetting password
    """
    salt = token_hex(32)

    token = generate_token(email, salt)
    token += "R3sET" 
    r.setex(token, 3600, salt)
    username = (get_session_info_email(email))["username"]

    full_url = url + "/reset_password/" + token
    content = f"""
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center; }}
            .container {{ background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }}
            .btn {{ display: inline-block; padding: 10px 20px; color: white; background-color: #FFFFFF; text-decoration: none; border-radius: 5px; border: 1px solid #000000; font-weight: bold; }}
            .btn:hover {{ background-color: #E0E0E0; }}
            p {{ color: #000000; }}
            a.btn {{ color: #000000; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Gander</h1>   
            <h2>Password Reset Request</h2>
            <p>Click the button below to reset your password for your account {username}. This link is valid for 1 hour.</p>
            <a href="{full_url}" class="btn">Reset Password</a>
        </div>
    </body>
    </html>
    """


    return content

def confirm_account_creation_body(email) -> str:
    """
    Handles account confirmation email body for account creation
    """
    salt = token_hex(32)

    token = generate_token(email, salt)
    token += "CrEaTe"
    r.setex(token, 3600, salt)

    full_url = url + "/confirm_account_creation/" + token

    content = f"""
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center; }}
            .container {{ background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }}
            .btn {{ display: inline-block; padding: 10px 20px; color: white; background-color: #FFFFFF; text-decoration: none; border-radius: 5px; border: 1px solid #000000; font-weight: bold; }}
            .btn:hover {{ background-color: #E0E0E0; }}
            p {{ color: #000000; }}
            a.btn {{ color: #000000; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Gander</h1>   
            <h2>Confirm Account Creation</h2>
            <p>Click the button below to create your account. This link is valid for 1 hour.</p>
            <a href="{full_url}" class="btn">Create Account</a>
        </div>
    </body>
    </html>
    """

    return content


def newsletter_conf(email):
    """
    Handles sending a confirmation email that a user has joined a newsletter
    """

    content = f"""
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center; }}
            .container {{ background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }}
            .btn {{ display: inline-block; padding: 10px 20px; color: white; background-color: #FFFFFF; text-decoration: none; border-radius: 5px; border: 1px solid #000000; font-weight: bold; }}
            .btn:hover {{ background-color: #E0E0E0; }}
            p {{ color: #000000; }}
            a.btn {{ color: #000000; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Gander</h1>   
            <h2>Welcome to the Official Gander Newsletter!</h2>
            <p>If you are receiving this email, it means that you have been officially added to the Monthly Gander newsletter.</p>
            <p>In this newsletter, you will receive updates about: your favourite streamers; important Gander updates; and more!</p>
            <small><a href="{url}">Unsubscribe?</a></small>
        </div>
    </body>
    </html>
    """

    return content
