# Python imports
import os, hashlib, json

# Lib imports
from flask import request, render_template, send_from_directory, redirect, url_for, session
from flask_login import current_user

# App imports
from .. import app, db, config, utils, Favorites, Settings


msgHandler    = utils.MessageHandler()
file_manager  = utils.FileManager(db, Settings)
logging       = utils.Logger().get_logger("Routes")

THIS_FILE_PTH = os.path.dirname(os.path.realpath(__file__))


@app.route('/', methods=['GET', 'POST'])
@app.route('/', methods=['GET', 'POST'], subdomain='webfm')
def home():
    _dHash  = file_manager.getDotHash()
    _ddHash = file_manager.getDotDotHash()

    return render_template('index.html', title='WebFM',
                            dHash=_dHash, ddHash=_ddHash)


@app.route('/list-files', methods=['GET', 'POST'])
@app.route('/list-files', methods=['GET', 'POST'], subdomain='webfm')
def listFilesRoute():
    if request.method == 'POST':
        HASH          = str(request.values['hash']).strip()
        pathPart      = file_manager.returnPathPartFromHash(HASH)
        lockedFolders = config["settings"]["locked_folders"].split("::::")
        path          = file_manager.getPath().split('/')
        lockedFolderInPath = False

        # Insure chilren folders are locked too.
        for folder in lockedFolders:
            if folder in path:
                lockedFolderInPath = True
                break

        if (pathPart in lockedFolders or lockedFolderInPath) and not current_user.is_authenticated:
            return redirect("/login")

        return listFiles(HASH)
    else:
        msg = "Can't manage the request type..."
        return msgHandler.createMessageJSON("danger", msg)

@app.route('/favorites', methods=['GET', 'POST'])
@app.route('/favorites', methods=['GET', 'POST'], subdomain='webfm')
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

@app.route('/load-favorite', methods=['GET', 'POST'])
@app.route('/load-favorite', methods=['GET', 'POST'], subdomain='webfm')
def loadFavorite():
    if request.method == 'POST':
        ID = str(request.values['id']).strip()
        try:
            ID   = int(ID)
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

@app.route('/manage-favorites', methods=['GET', 'POST'])
@app.route('/manage-favorites', methods=['GET', 'POST'], subdomain='webfm')
def manageFavoritesRoute():
    if request.method == 'POST':
        ACTION = str(request.values['action']).strip()
        PATH   = str(request.values['path']).strip()

        if ACTION == "add":
            fave = Favorites(link=PATH)
            db.session.add(fave)
            msg = "Added to Favorites successfully..."
        else:
            fave = db.session.query(Favorites).filter_by(link=PATH).first()
            db.session.delete(fave)
            msg = "Deleted from Favorites successfully..."

        db.session.commit()

        return msgHandler.createMessageJSON("success", msg)
    else:
        msg = "Can't manage the request type..."
        return msgHandler.createMessageJSON("danger", msg)


@app.route('/reset-path', methods=['GET', 'POST'])
@app.route('/reset-path', methods=['GET', 'POST'], subdomain='webfm')
def resetPath():
    if request.method == 'GET':
        file_manager.reset_path()
        return redirect("/")


# Used to get files from non gunicorn root path...
# Allows us to pull images and stuff to user without simlinking.
@app.route('/files/<hash>')
def returnFile(hash):
    path     = file_manager.getFullPath()
    pathPart = file_manager.returnPathPartFromHash(hash)
    return send_from_directory(path, pathPart)

@app.route('/remux/<hash>')
def remuxRoute(hash):
    folder  = file_manager.getFullPath()
    file    = file_manager.returnPathPartFromHash(hash)
    fpath   = os.path.join(folder, file)

    logging.debug(fpath)

    return file_manager.remuxVideo(hash, fpath)

@app.route('/run-locally/<hash>')
def runLocallyRoute(hash):
    path     = file_manager.getFullPath()
    pathPart = file_manager.returnPathPartFromHash(hash)
    fullpath = path + "/" + pathPart

    logging.debug(fullpath)

    file_manager.openFilelocally(fullpath)
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
