# Python imports

# Lib imports
from flask import request, render_template, flash, redirect, url_for
from flask_login import current_user, login_user, logout_user

# App imports
from ... import app, bcrypt, db, User, LoginForm
from ...utils import MessageHandler   # Get simple message processor


msgHandler = MessageHandler()
TITLE      = app.config['TITLE']

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("home"))

    _form = LoginForm()
    if _form.validate_on_submit():
        user = db.session.query(User).filter(User.username == _form.username.data).first()

        if user and bcrypt.check_password_hash(user.password, _form.password.data):
            login_user(user, remember=False)
            flash("Logged in successfully!", "success")
            return redirect("/")

        flash("Username or password incorrect! Please try again...", "danger")

    return render_template('login.html', title=TITLE, form=_form)


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    logout_user()
    flash("Logged out successfully!", "success")
    return redirect("/login")
