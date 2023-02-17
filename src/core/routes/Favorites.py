# Python imports

# Lib imports
from flask import request

# App imports
from core import app
from core import db
from core import Favorites             # Get from __init__



@app.route('/api/list-favorites', methods=['GET', 'POST'])
def list_favorites():
    if request.method == 'POST':
        list  = db.session.query(Favorites).all()
        faves = []
        for fave in list:
            faves.append([fave.link, fave.id])

        return json_message.faves_list(faves)

    msg = "Can't manage the request type..."
    return json_message.create("danger", msg)

@app.route('/api/load-favorite/<_id>', methods=['GET', 'POST'])
def load_favorite(_id):
    if request.method == 'POST':
        try:
            ID   = int(_id)
            fave = db.session.query(Favorites).filter_by(id = ID).first()
            view = get_view()
            view.set_path_with_sub_path(fave.link)
            return '{"refresh": "true"}'
        except Exception as e:
            print(repr(e))
            msg = "Incorrect Favorites ID..."
            return json_message.create("danger", msg)

    msg = "Can't manage the request type..."
    return json_message.create("danger", msg)


@app.route('/api/manage-favorites/<_action>', methods=['GET', 'POST'])
def manage_favorites(_action):
    if request.method == 'POST':
        ACTION   = _action.strip()
        view     = get_view()
        sub_path = view.get_current_sub_path()

        if ACTION == "add":
            fave = Favorites(link = sub_path)
            db.session.add(fave)
            msg  = "Added to Favorites successfully..."
        elif ACTION == "delete":
            fave = db.session.query(Favorites).filter_by(link = sub_path).first()
            db.session.delete(fave)
            msg  = "Deleted from Favorites successfully..."
        else:
            msg  = "Couldn't handle action for favorites item..."
            return json_message.create("danger", msg)

        db.session.commit()
        return json_message.create("success", msg)

    msg = "Can't manage the request type..."
    return json_message.create("danger", msg)
