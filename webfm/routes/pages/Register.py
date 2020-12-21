# Python imports

# Lib imports
from flask import request, render_template, url_for, redirect, flash

# App imports
from ... import app, bcrypt, db, current_user, RegisterForm   # Get from __init__
from ...models import User
from ...utils import MessageHandler   # Get simple message processor


msgHandler = MessageHandler()

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect("/home")

    _form = RegisterForm()
    if _form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(_form.password.data).decode("utf-8")
        user = User(username=_form.username.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash("Account created successfully!", "success")
        return redirect("/login")

    return render_template('register.html',
                            form = _form)
