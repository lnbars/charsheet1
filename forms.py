#cython: language_level=3
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, SelectField
from wtforms.validators import ValidationError, DataRequired, Email, EqualTo, Length

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password')
    submit = SubmitField('Sign In')

class UserAddForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password')
    distinguishedname = StringField('Distinguished Name')
    role = SelectField('Role', choices=[('user', 'User'), ('admin', 'Admin')])
    submit = SubmitField('Add user')
    update = SubmitField('Update user')

class PwdChangeForm(FlaskForm):
    password = PasswordField('Password', validators=[DataRequired()])
    repeatpassword = PasswordField('Repeat Password', validators=[DataRequired()])
    oldpassword = PasswordField('Old Password', validators=[DataRequired()])
    update = SubmitField('Update user')
