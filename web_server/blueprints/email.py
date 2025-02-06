import smtplib
from email.mime.text import MIMEText

from os import getenv
from random import randrange
from dotenv import load_dotenv
from utils.user_utils import generate_token
from secrets import token_hex


load_dotenv()

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
    login_code = randrange(100000, 1000000)
    body = func()
    print(body, flush=True)
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

def forgot_password_body(email):
    token = generate_token(email, token_hex(32))
    url = getenv("VITE_API_URL")

    full_url = url + "/reset_password/" + token
    content = f"""
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Password Reset</title>
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center; }}
            .container {{ max-width: 400px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }}
            .btn {{ display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px; }}
            .btn:hover {{ background-color: #0056b3; }}
            p {{ color: #333; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Gander</h1>   
            <h2>Password Reset Request</h2>
            <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
            <a href="{full_url}" class="btn">Reset Password</a>
        </div>
    </body>
    </html>
    """

    return content