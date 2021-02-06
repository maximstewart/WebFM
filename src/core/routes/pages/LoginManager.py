# Python imports

# Lib imports
from flask import redirect, url_for, flash

# App imports
from core import app


ROUTE = app.config['LOGIN_PATH']


@app.route('/login', methods=['GET', 'POST'])
def login():
    if ROUTE == "OIDC":
        return redirect(url_for("oidc_login"))
    if ROUTE == "FLASK_LOGIN":
        return redirect(url_for("app_login"))

    flash("No Login Path Accessable! Please contact an Administrator!", "danger")
    return redirect(url_for("home"))


@app.route('/logout')
def logout():
    if ROUTE == "OIDC":
        return redirect(url_for("oidc_logout"))
    if ROUTE == "FLASK_LOGIN":
        return redirect(url_for("app_logout"))

    flash("No Logout Path Accessable! Please contact an Administrator!", "danger")
    return redirect(url_for("home"))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if ROUTE == "OIDC":
        return redirect(url_for("oidc_register"))
    if ROUTE == "FLASK_LOGIN":
        return redirect(url_for("app_register"))

    flash("No Register Path Accessable! Please contact an Administrator!", "danger")
    return redirect(url_for("home"))
