# Python imports

# Lib imports
from flask import render_template
from flask import url_for
from flask import redirect
from flask import flash

# App imports
                # Get from __init__
from core import app
from core import bcrypt
from core import db
from core import current_user
from core import RegisterForm
from core.models import User



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
