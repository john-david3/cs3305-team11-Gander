import smtplib
from email.mime.text import MIMEText

from os import getenv
from random import randrange
from dotenv import load_dotenv

load_dotenv()

def send_email(email) -> None:
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
    body = f"""
    <html>
        <head></head>
        <body>
            <h1>Thank you for choosing Gander</h1>
            <p>Your Gander login code is: {login_code}</p>
        </body>
    </html>
    """
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
            print("Server timed out")

        except Exception as e:
            print("Error: ", e)