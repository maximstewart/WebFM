# System import
import os, json, secrets
from datetime import timedelta


# Lib imports
from flask import Flask
from flask_oidc import OpenIDConnect


# Apoplication imports



# Configs and 'init'
APP_NAME      = 'WebFM'
ROOT_FILE_PTH = os.path.dirname(os.path.realpath(__file__))
CONFIG_FILE   = ROOT_FILE_PTH + "/config.json"
# This path is submitted as the redirect URI in certain code flows.
REDIRECT_LINK = "https%3A%2F%2Fwww.webfm.com%2F"


app = Flask(__name__)
app.config.update({
                "TITLE": APP_NAME,
                'DEBUG': False,
                'SECRET_KEY': secrets.token_hex(32),
                'PERMANENT_SESSION_LIFETIME': timedelta(days = 7).total_seconds(),
                "SQLALCHEMY_DATABASE_URI": "sqlite:///static/db/webfm.db",
                "SQLALCHEMY_TRACK_MODIFICATIONS": False,
                "APP_REDIRECT_URI": REDIRECT_LINK,
                'OIDC_CLIENT_SECRETS': ROOT_FILE_PTH + '/client_secrets.json',
                'OIDC_ID_TOKEN_COOKIE_SECURE': True, # Only set false in development setups...
                'OIDC_REQUIRE_VERIFIED_EMAIL': False,
                'OIDC_USER_INFO_ENABLED': True,
                'OIDC_VALID_ISSUERS': [
                                        'http://www.ssoapps.com/auth/realms/apps',
                                        'https://www.ssoapps.com/auth/realms/apps'
                                        ],
                'OIDC_TOKEN_TYPE_HINT': 'access_token'
                })

oidc = OpenIDConnect(app)
def oidc_loggedin():
    return oidc.user_loggedin
app.jinja_env.globals['oidc_loggedin'] = oidc_loggedin
app.jinja_env.globals['TITLE']         =  APP_NAME



# Settings data
def retrieveSettings():
    returnData = []

    with open(CONFIG_FILE) as infile:
        try:
            return json.load(infile)
        except Exception as e:
            print(repr(e))
            returnData = ['', 'mplayer', 'xdg-open']

config = retrieveSettings()


from .models import db, Favorites, Settings
db.init_app(app)
with app.app_context(): db.create_all()
from webfm import routes
