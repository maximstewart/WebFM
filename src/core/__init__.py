# Python imports
import os


# Lib imports
from flask import Flask
    #OIDC Login path
from flask_oidc import OpenIDConnect
    # Flask Login Path
from flask_bcrypt import Bcrypt
from flask_login import current_user, login_user, logout_user, LoginManager


# Apoplication imports
from core.utils import Logger


app = Flask(__name__)
app.config.from_object("core.config.Config")

oidc          = OpenIDConnect(app)
login_manager = LoginManager(app)
bcrypt        = Bcrypt(app)
logger        = Logger().get_logger()

def oidc_loggedin():
    return oidc.user_loggedin

def oidc_isAdmin():
    if oidc_loggedin():
        isAdmin = oidc.user_getfield("isAdmin")
        if isAdmin == "yes" :
            return True
    return False

app.jinja_env.globals['oidc_loggedin'] = oidc_loggedin
app.jinja_env.globals['oidc_isAdmin']  = oidc_isAdmin
app.jinja_env.globals['TITLE']         = app.config["TITLE"]


from core.models import db, User, Favorites
db.init_app(app)
with app.app_context():
    db.create_all()

from core.forms import RegisterForm, LoginForm
from core import routes
