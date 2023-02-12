# Python imports
import os
import re

# Lib imports
from flask import request

from flask_uploads import ALL
from flask_uploads import configure_uploads
from flask_uploads import UploadSet

# App imports
                                            # Get from __init__
from core import app
from core import db
from core import Favorites
from core import oidc



@app.route('/api/delete/<_hash>', methods=['GET', 'POST'])
def delete_item(_hash = None):
    if request.method == 'POST':
        msg = "Log in with an Admin privlidged user to delete files!"
        if not oidc.user_loggedin:
            return json_message.create("danger", msg)
        elif oidc.user_loggedin:
            isAdmin = oidc.user_getfield("isAdmin")
            if isAdmin != "yes" :
                return json_message.create("danger", msg)

        view   = get_view()
        folder = view.get_current_directory()
        file   = view.get_path_part_from_hash(_hash)
        fpath  = os.path.join(folder, file)
        try:
            msg = f"[Success] Deleted the file/folder -->:  {file}  !"
            view.delete_file(fpath)
            return json_message.create("success", msg)
        except Exception as e:
            msg = "[Error] Unable to delete the file/folder...."
            return json_message.create("danger", msg)



@app.route('/api/create/<_type>', methods=['GET', 'POST'])
def create_item(_type = None):
    if request.method == 'POST':
        msg = "Log in with an Admin privlidged user to upload files!"
        if not oidc.user_loggedin:
            return json_message.create("danger", msg)
        elif oidc.user_loggedin:
            isAdmin = oidc.user_getfield("isAdmin")
            if isAdmin != "yes" :
                return json_message.create("danger", msg)

        TYPE    = _type.strip()
        if not TYPE in ["dir", "file"]:
            msg = "Couldn't handle action type for api create..."
            return json_message.create("danger", msg)

        FNAME   = str(request.values['fname']).strip()
        if not re.fullmatch(valid_fname_pat, FNAME):
            msg = "A new item name can only contain alphanumeric, -, _, |, [], (), or spaces and must be minimum of 4 and max of 20 characters..."
            return json_message.create("danger", msg)

        try:
            view     = get_view()
            folder   = view.get_current_directory()
            new_item = f"{folder}/{FNAME}"
            view.create_file(new_item, TYPE)
        except Exception as e:
            print(repr(e))
            msg  = "Couldn't create file/folder. An unexpected error occured..."
            return json_message.create("danger", msg)


        msg = "[Success] created the file/dir..."
        return json_message.create("success", msg)
    else:
        msg = "Can't manage the request type..."
        return json_message.create("danger", msg)


@app.route('/api/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST' and len(request.files) > 0:
        msg = "Log in with an Admin privlidged user to upload files!"
        if not oidc.user_loggedin:
            return json_message.create("danger", msg)
        elif oidc.user_loggedin:
            isAdmin = oidc.user_getfield("isAdmin")
            if isAdmin != "yes" :
                return json_message.create("danger", msg)

        view         = get_view()
        folder       = view.get_current_directory()
        UPLOADS_PTH  = f'{folder}/'
        files        = UploadSet('files', ALL, default_dest=lambda x: UPLOADS_PTH)
        configure_uploads(app, files)

        try:
            for file in request.files:
                files.save(request.files[file])
        except Exception as e:
            print(repr(e))
            msg = "[Error] Failed to upload some or all of the file(s)..."
            return json_message.create("danger", msg)

        msg = "[Success] Uploaded file(s)..."
        return json_message.create("success", msg)
    else:
        msg = "Can't manage the request type..."
        return json_message.create("danger", msg)
