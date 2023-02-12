# Python imports

# Lib imports
from flask import request
from flask import render_template
from flask import flash
from flask import redirect
from flask import url_for

from flask_login import current_user
from flask_login import login_user
from flask_login import logout_user

# App imports
from core import app
from core import bcrypt
from core import db
from core import User
from core import LoginForm



@app.route('/app-login', methods=['GET', 'POST'])
def app_login():
    if current_user.is_authenticated:
        return redirect(url_for("home"))

    _form = LoginForm()
    if _form.validate_on_submit():
        user = db.session.query(User).filter(User.username == _form.username.data).first()

        if user and bcrypt.check_password_hash(user.password, _form.password.data):
            login_user(user, remember=False)
            flash("Logged in successfully!", "success")
            return redirect(url_for("home"))

        flash("Username or password incorrect! Please try again...", "danger")

    return render_template('pages/login.html', form = _form)


@app.route('/app-logout')
def app_logout():
    logout_user()
    flash("Logged out successfully!", "success")
    return redirect(url_for("home"))
