# System imports

# Lib imports
from flask_sqlalchemy import SQLAlchemy

# App imports
from . import app


db = SQLAlchemy(app)


class Favorites(db.Model):
    link = db.Column(db.String, nullable=False, unique=True)
    id   = db.Column(db.Integer, nullable=False, primary_key=True, unique=True, autoincrement=True)

    def __repr__(self):
        return f"['{self.link}', '{self.id}']"

class Settings(db.Model):
    key   = db.Column(db.String, nullable=False)
    value = db.Column(db.String, nullable=False)
    id    = db.Column(db.Integer, nullable=False, primary_key=True, unique=True, autoincrement=True)

    def __repr__(self):
        return f"['{self.key}', '{self.value}', '{self.id}']"
