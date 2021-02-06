# Python imports

# Lib imports
from flask import request, render_template, url_for, redirect, flash

# App imports
from core import app, bcrypt, db, current_user, RegisterForm   # Get from __init__
from core.models import User
from core.utils import MessageHandler   # Get simple message processor


msgHandler = MessageHandler()


@app.route('/app-register', methods=['GET', 'POST'])
def app_register():
    if current_user.is_authenticated:
        return redirect(url_for("home"))

    _form = RegisterForm()
    if _form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(_form.password.data).decode("utf-8")
        user = User(username = _form.username.data, email = _form.email.data, password = hashed_password)
        db.session.add(user)
        db.session.commit()
        flash("Account created successfully!", "success")
        return redirect(url_for("login"))

    return render_template('pages/register.html',
                            form  = _form)
