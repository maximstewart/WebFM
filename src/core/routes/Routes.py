# Python imports
import os, json, secrets

# Lib imports
from flask import request, session, render_template, send_from_directory, redirect
from flask_login import current_user


# App imports
from core import app, logger, oidc, db, Favorites  # Get from __init__
from core.utils import MessageHandler              # Get simple message processor
from core.utils.shellfm import WindowController    # Get file manager controller


msgHandler         = MessageHandler()
window_controllers = {}


def get_window_controller():
    if session.get('win_controller_id') is None:
        id         = secrets.token_hex(16)
        controller = WindowController()
        view       = controller.get_window(1).get_view(0)
        view.ABS_THUMBS_PTH = app.config['ABS_THUMBS_PTH']
        view.REMUX_FOLDER   = app.config['REMUX_FOLDER']
        view.FFMPG_THUMBNLR = app.config['FFMPG_THUMBNLR']
        view.logger         = logger

        session['win_controller_id'] = id
        window_controllers.update( {id: controller } )

    return window_controllers[ session["win_controller_id"]  ]


@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'GET':
        view               = get_window_controller().get_window(1).get_view(0)
        _dot_dots          = view.get_dot_dots()
        _current_directory = view.get_current_directory()
        return render_template('pages/index.html', current_directory = _current_directory, dot_dots = _dot_dots)

    return render_template('error.html', title = 'Error!',
                            message = 'Must use GET request type...')


@app.route('/api/list-files/<_hash>', methods=['GET', 'POST'])
def listFiles(_hash = None):
    if request.method == 'POST':
        view     = get_window_controller().get_window(1).get_view(0)
        dot_dots = view.get_dot_dots()

        if dot_dots[0][1] == _hash:    # Refresh
            view.load_directory()
        elif dot_dots[1][1] == _hash:  # Pop from dir
            view.pop_from_path()

        msg       = "Log in with an Admin privlidged user to view the requested path!"
        is_locked = view.is_folder_locked(_hash)
        if is_locked and not oidc.user_loggedin:
            return msgHandler.createMessageJSON("danger", msg)
        elif is_locked and oidc.user_loggedin:
            isAdmin = oidc.user_getfield("isAdmin")
            if isAdmin != "yes" :
                return msgHandler.createMessageJSON("danger", msg)

        if dot_dots[0][1] != _hash and dot_dots[1][1] != _hash:
            path = view.get_path_part_from_hash(_hash)
            view.push_to_path(path)

        sub_path = view.get_current_sub_path()
        files    = view.get_files_formatted()
        fave     = db.session.query(Favorites).filter_by(link = sub_path).first()
        in_fave  = "true" if fave else "false"
        files.update({'in_fave': in_fave})
        return files
    else:
        msg = "Can't manage the request type..."
        return msgHandler.createMessageJSON("danger", msg)

@app.route('/api/file-manager-action/<_type>/<_hash>')
def fileManagerAction(_type, _hash = None):
    view = get_window_controller().get_window(1).get_view(0)

    if _type == "reset-path" and _hash == None:
        view.set_to_home()
        return redirect("/")

    folder = view.get_current_directory()
    file   = view.get_path_part_from_hash(_hash)
    fpath  = os.path.join(folder, file)
    logger.debug(fpath)

    if _type == "files":
        return send_from_directory(folder, file)
    if _type == "remux":
        # NOTE: Need to actually implimint a websocket to communicate back to client that remux has completed.
        # As is, the remux thread hangs until completion and client tries waiting until server reaches connection timeout.
        # I.E....this is stupid but for now works better than nothing
        good_result = view.remuxVideo(_hash, fpath)
        if good_result:
            return '{"path":"static/remuxs/' + _hash + '.mp4"}'
        else:
            msg = "Remuxing: Remux failed or took too long; please, refresh the page and try again..."
            return msgHandler.createMessageJSON("success", msg)
    if _type == "run-locally":
        msg = "Opened media..."
        view.openFilelocally(fpath)
        return msgHandler.createMessageJSON("success", msg)


@app.route('/api/list-favorites', methods=['GET', 'POST'])
def listFavorites():
    if request.method == 'POST':
        list  = db.session.query(Favorites).all()
        faves = []
        for fave in list:
            faves.append([fave.link, fave.id])

        return '{"faves_list":' + json.dumps(faves) + '}'
    else:
        msg = "Can't manage the request type..."
        return msgHandler.createMessageJSON("danger", msg)

@app.route('/api/load-favorite/<_id>', methods=['GET', 'POST'])
def loadFavorite(_id):
    if request.method == 'POST':
        try:
            ID   = int(_id)
            fave = db.session.query(Favorites).filter_by(id = ID).first()
            view = get_window_controller().get_window(1).get_view(0)
            view.set_path_with_sub_path(fave.link)
            return '{"refresh": "true"}'
        except Exception as e:
            print(repr(e))
            msg = "Incorrect Favorites ID..."
            return msgHandler.createMessageJSON("danger", msg)
    else:
        msg = "Can't manage the request type..."
        return msgHandler.createMessageJSON("danger", msg)


@app.route('/api/manage-favorites/<_action>', methods=['GET', 'POST'])
def manageFavorites(_action):
    if request.method == 'POST':
        ACTION   = _action.strip()
        view     = get_window_controller().get_window(1).get_view(0)
        sub_path = view.get_current_sub_path()

        if ACTION == "add":
            fave = Favorites(link = sub_path)
            db.session.add(fave)
            msg  = "Added to Favorites successfully..."
        else:
            fave = db.session.query(Favorites).filter_by(link = sub_path).first()
            db.session.delete(fave)
            msg  = "Deleted from Favorites successfully..."

        db.session.commit()
        return msgHandler.createMessageJSON("success", msg)
    else:
        msg = "Can't manage the request type..."
        return msgHandler.createMessageJSON("danger", msg)
