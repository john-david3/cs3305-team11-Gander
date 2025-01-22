from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField, EmailField, PasswordField
from wtforms.validators import InputRequired, EqualTo

class SignupForm(FlaskForm):
    username = StringField("Username:", validators=[InputRequired()])
    email = EmailField("Email:", validators=[InputRequired()])
    password = PasswordField("Password:", validators=[InputRequired()])
    password2 = PasswordField("Confirm Password:", validators=[InputRequired(), EqualTo("password")])
    submit = SubmitField("Submit")

class LoginForm(FlaskForm):
    username = StringField("Username:", validators=[InputRequired()])
    password = PasswordField("Password:", validators=[InputRequired()])
    submit = SubmitField("Submit")