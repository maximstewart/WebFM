# Python imports
import secrets

# Lib imports
from flask import request, session, render_template, send_from_directory, redirect
from flask_login import current_user


# App imports
from core import app, logger, oidc, db  # Get from __init__
from core.utils import MessageHandler   # Get simple message processor
from core.utils.shellfm import WindowController   # Get file manager controller


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
def listFilesRoute(_hash = None):
    if request.method == 'POST':
        view = get_window_controller().get_window(1).get_view(0)

        if _dot_dots[0][1] == HASH:    # Refresh
            view.load_directory()
        elif _dot_dots[1][1] == HASH:  # Pop from dir
            view.pop_from_path()
        else:                          # Push to dir
            _path = view.get_path_part_from_hash(HASH)
            view.push_to_path(_path)


        msg       = "Log in with an Admin privlidged user to view the requested path!"
        fave      = db.session.query(Favorites).filter_by(link=_path).first()
        _in_fave  = "true" if fave else "false"
        _dot_dots = view.get_dot_dots()
        _files    = view.get_files_formatted()
        _path     = view.get_current_directory()
        is_locked = view.is_folder_locked(HASH)

        files.update({'in_fave': _in_fave})
        if is_locked and not oidc.user_loggedin:
            return msgHandler.createMessageJSON("danger", msg)
        elif is_locked and oidc.user_loggedin:
            isAdmin = oidc.user_getfield("isAdmin")
            if isAdmin != "yes" :
                return msgHandler.createMessageJSON("danger", msg)

        return files

    else:
        msg = "Can't manage the request type..."
        return msgHandler.createMessageJSON("danger", msg)

@app.route('/api/file-manager-action/<_type>/<_hash>')
def file_manager_action(_type, _hash = None):
    view = get_window_controller().get_window(1).get_view(0)

    if _type == "reset-path" and _hash == None:
        view.set_to_home()
        return redirect("/")


    folder = view.get_path()
    file   = view.returnPathPartFromHash(hash)
    fpath  = os.path.join(folder, file)
    logging.debug(fpath)

    if _type == "files":
        return send_from_directory(folder, file)
    if _type == "remux":
        # NOTE: Need to actually implimint a websocket to communicate back to client that remux has completed.
        # As is, the remux thread hangs until completion and client tries waiting until server reaches connection timeout.
        # I.E....this is stupid but for now works better than nothing
        return view.remuxVideo(hash, fpath)
    if _type == "run-locally":
        view.openFilelocally(fpath)
        return msgHandler.createMessageJSON("success", msg)


@app.route('/api/get-favorites', methods=['GET', 'POST'])
def getAllFavoritesRoute():
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
            fave = db.session.query(Favorites).filter_by(id=ID).first()
            file_manager.setNewPathFromFavorites(fave.link)
            file_manager.loadPreviousPath()

            return '{"refresh":"true"}'
        except Exception as e:
            print(repr(e))
            msg = "Incorrect Favorites ID..."
            return msgHandler.createMessageJSON("danger", msg)
    else:
        msg = "Can't manage the request type..."
        return msgHandler.createMessageJSON("danger", msg)


@app.route('/api/manage-favorites/<_action>', methods=['GET', 'POST'])
def manageFavoritesRoute(_action):
    if request.method == 'POST':
        ACTION = _action.strip()
        path   = file_manager.getPath()

        if ACTION == "add":
            fave = Favorites(link=path)
            db.session.add(fave)
            msg  = "Added to Favorites successfully..."
        else:
            fave = db.session.query(Favorites).filter_by(link=path).first()
            db.session.delete(fave)
            msg  = "Deleted from Favorites successfully..."

        db.session.commit()
        return msgHandler.createMessageJSON("success", msg)
    else:
        msg = "Can't manage the request type..."
        return msgHandler.createMessageJSON("danger", msg)
