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
        id = secrets.token_hex(16)
        session['win_controller_id'] = id
        window_controllers.update( {id: WindowController() } )

    return window_controllers[ session["win_controller_id"]  ]


@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'GET':
        view   = get_window_controller().get_window(1).get_view(0)
        _path  = view.get_path()
        _files = view.get_files()
        return render_template('pages/index.html', path=_path, files=_files)

    return render_template('error.html',
                            title='Error!',
                            message='Must use GET request type...')


@app.route('/api/list-files/<_hash>', methods=['GET', 'POST'])
def listFilesRoute(_hash):
    if request.method == 'POST':
        HASH          = _hash.strip()
        pathPart      = file_manager.returnPathPartFromHash(HASH)
        lockedFolders = config["settings"]["locked_folders"].split("::::")
        path          = file_manager.getPath().split('/')
        lockedFolderInPath = False

        # Insure chilren folders are locked too.
        for folder in lockedFolders:
            if folder in path:
                lockedFolderInPath = True
                break

        isALockedFolder = (pathPart in lockedFolders or lockedFolderInPath)
        msg = "Log in with an Admin privlidged user to view the requested path!"
        if isALockedFolder and not oidc.user_loggedin:
            return msgHandler.createMessageJSON("danger", msg)
        elif isALockedFolder and oidc.user_loggedin:
            isAdmin = oidc.user_getfield("isAdmin")
            if isAdmin != "yes" :
                return msgHandler.createMessageJSON("danger", msg)

        return listFiles(HASH)
    else:
        msg = "Can't manage the request type..."
        return msgHandler.createMessageJSON("danger", msg)


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


@app.route('/api/reset-path', methods=['GET', 'POST'])
def resetPath():
    if request.method == 'GET':
        view = get_window_controller().get_window(1).get_view(0)
        view.set_to_home()
        return redirect("/")

# Used to get files from non gunicorn root path...
# Allows us to pull images and stuff to user without simlinking.
@app.route('/api/files/<hash>')
def returnFile(hash):
    view   = get_window_controller().get_window(1).get_view(0)
    folder = view.get_path()
    file   = view.returnPathPartFromHash(hash)
    return send_from_directory(folder, file)

@app.route('/api/remux/<hash>')
def remuxRoute(hash):
    view   = get_window_controller().get_window(1).get_view(0)
    folder = view.get_path()
    file   = view.returnPathPartFromHash(hash)
    fpath  = os.path.join(folder, file)

    logging.debug(fpath)
    return view.remuxVideo(hash, fpath)

@app.route('/api/run-locally/<hash>')
def runLocallyRoute(hash):
    view   = get_window_controller().get_window(1).get_view(0)
    folder = view.get_path()
    file   = view.returnPathPartFromHash(hash)
    fpath  = os.path.join(folder, file)

    logging.debug(fpath)
    view.openFilelocally(fpath)

    msg = "Opened media..."
    return msgHandler.createMessageJSON("success", msg)



def listFiles(HASH):
    state = file_manager.generateLists(HASH)
    if "error" in state:
        msg = "Listing files failed..."
        return msgHandler.createMessageJSON("danger", msg)

    path    = file_manager.getPath()
    fave    = db.session.query(Favorites).filter_by(link=path).first()
    in_fave = "true" if fave else "false"

    dirs    = json.dumps( file_manager.getDirs() )
    vids    = json.dumps( file_manager.getVids() )
    imgs    = json.dumps( file_manager.getImgs() )
    files   = json.dumps( file_manager.getFiles() )

    return '{"path_head":"' + path + '"' + \
            ',"in_fave":"'   + in_fave + '"' + \
            ',"list":{"dirs":'   + dirs + \
                    ', "vids":'  + vids + \
                    ', "imgs":'  + imgs + \
                    ', "files":' + files + '}}'
