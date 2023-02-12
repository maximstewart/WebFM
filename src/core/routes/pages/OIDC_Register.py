# Python imports

# Lib imports
from flask import request
from flask import render_template
from flask import url_for
from flask import redirect
from flask import flash

# App imports
        # Get from __init__
from ... import app
from ... import oidc
from ... import db



@app.route('/oidc-register', methods=['GET', 'POST'])
def oidc_register():
    if oidc.user_loggedin:
        return redirect("/home")

    _form = RegisterForm()
    if _form.validate_on_submit():
        # TODO: Create...
        # NOTE: Do a requests api here maybe??

        # hashed_password = bcrypt.generate_password_hash(_form.password.data).decode("utf-8")
        # user = User(username=_form.username.data, password=hashed_password)
        # db.session.add(user)
        # db.session.commit()
        flash("Account created successfully!", "success")
        return redirect("/login")

    return render_template('pages/register.html', form  = _form)
