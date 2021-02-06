# Python imports

# Lib imports
from flask import request, redirect, flash


# App imports
from ... import app, oidc


@app.route('/oidc-login', methods=['GET', 'POST'])
@oidc.require_login
def oidc_login():
    return redirect("/")


@app.route('/oidc-logout', methods=['GET', 'POST'])
@oidc.require_login
def oidc_logout():
    oidc.logout()
    flash("Logged out successfully!", "success")
    # NOTE: Need to redirect to logout on OIDC server to end session there too.
    # If not, we can hit login url again and get same token until it expires.
    return redirect( oidc.client_secrets.get('issuer')
                + '/protocol/openid-connect/logout?redirect_uri='
                + app.config['APP_REDIRECT_URI'])
