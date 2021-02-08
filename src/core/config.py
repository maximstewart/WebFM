# System import
import os, secrets
from datetime import timedelta


# Lib imports


# Apoplication imports


APP_NAME = 'WebFM'
# Configs
ROOT_FILE_PTH = os.path.dirname(os.path.realpath(__file__))
# This path is submitted as the redirect URI in certain code flows.
REDIRECT_LINK = "https%3A%2F%2Fwww.webfm.com%2F"




class Config(object):
    TITLE      = APP_NAME
    DEBUG      = False
    TESTING    = False
    SECRET_KEY = secrets.token_hex(32)

    PERMANENT_SESSION_LIFETIME     = timedelta(days = 7).total_seconds()
    SQLALCHEMY_DATABASE_URI        = "sqlite:///static/db/webfm.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    LOGIN_PATH                     = "FLASK_LOGIN"  # Value can be OIDC or FLASK_LOGIN
    OIDC_TOKEN_TYPE_HINT           = 'access_token'
    APP_REDIRECT_URI               = REDIRECT_LINK
    OIDC_CLIENT_SECRETS            = ROOT_FILE_PTH + '/client_secrets.json'
    OIDC_ID_TOKEN_COOKIE_SECURE    = True
    OIDC_REQUIRE_VERIFIED_EMAIL    = True
    OIDC_USER_INFO_ENABLED         = True
    OIDC_VALID_ISSUERS   = [
                            'http://localhost:8080/auth/realms/apps',
                            'https://localhost:443/auth/realms/apps'
                        ]

    STATIC_FPTH    = ROOT_FILE_PTH + "/static"
    REMUX_FOLDER   = STATIC_FPTH   + "/remuxs"             # Remuxed files folder
    FFMPG_THUMBNLR = STATIC_FPTH   + "/ffmpegthumbnailer"  # Thumbnail generator binary

    ABS_THUMBS_PTH = STATIC_FPTH + "/imgs/thumbnails"      # Used for thumbnail generation
    REL_THUMBS_PTH = "static/imgs/thumbnails"              # Used for flask thumbnail return




class ProductionConfig(Config):
    pass



class DevelopmentConfig(Config):
    DEBUG = True
    OIDC_ID_TOKEN_COOKIE_SECURE = False
    OIDC_REQUIRE_VERIFIED_EMAIL = False


class TestingConfig(Config):
    TESTING = True
