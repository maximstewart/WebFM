# system import
import os, json, secrets
from datetime import timedelta

# Flask imports
from flask import Flask, Blueprint
from flask_login import current_user, login_user, logout_user, LoginManager
from flask_bcrypt import Bcrypt



# Configs and 'init'
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///static/db/webfm.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['TITLE'] = 'WebFM'

# For csrf and some other stuff...
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days = 7)
app.config['SECRET_KEY'] = secrets.token_hex(32)
login_manager            = LoginManager(app)
bcrypt                   = Bcrypt(app)

# Settings data
THIS_FILE_PTH = os.path.dirname(os.path.realpath(__file__))
CONFIG_FILE   = THIS_FILE_PTH + "/config.json"
def retrieveSettings():
    returnData = []

    with open(CONFIG_FILE) as infile:
        try:
            return json.load(infile)
        except Exception as e:
            print(repr(e))
            returnData = ['', 'mplayer', 'xdg-open']

config = retrieveSettings()


from .forms import LoginForm, RegisterForm
from .models import db, Favorites, Settings, User
from webfm import routes

with app.app_context():
    db.create_all()
