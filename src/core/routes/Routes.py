# Python imports
import os
import requests
import uuid

# Lib imports
from flask import make_response
from flask import redirect
from flask import request
from flask import render_template
from flask import session
from flask import send_from_directory

# App imports
                            # Get from __init__
from core import app
from core import db
from core import Favorites
from core import oidc



@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'GET':
        view               = get_view()
        sse_id             = get_sse_id()
        _dot_dots          = view.get_dot_dots()
        _current_directory = view.get_current_directory()

        response = make_response(
            render_template(
                'pages/index.html',
                current_directory = _current_directory,
                dot_dots = _dot_dots
            )
        )
        response.set_cookie('sse_id', sse_id, secure=True, httponly = False)
        return response

    return render_template('error.html', title = 'Error!',
                            message = 'Must use GET request type...')


@app.route('/api/list-files/<_hash>', methods=['GET', 'POST'])
def list_files(_hash = None):
    if request.method == 'POST':
        view     = get_view()
        dot_dots = view.get_dot_dots()

        if dot_dots[0][1] == _hash:    # Refresh
            view.load_directory()
        elif dot_dots[1][1] == _hash:  # Pop from dir
            view.pop_from_path()

        msg       = "Log in with an Admin privlidged user to view the requested path!"
        is_locked = view.is_folder_locked(_hash)
        if is_locked and not oidc.user_loggedin:
            return json_message.create("danger", msg)
        elif is_locked and oidc.user_loggedin:
            isAdmin = oidc.user_getfield("isAdmin")
            if isAdmin != "yes" :
                return json_message.create("danger", msg)

        if dot_dots[0][1] != _hash and dot_dots[1][1] != _hash:
            path = view.get_path_part_from_hash(_hash)
            view.push_to_path(path)

        error_msg = view.get_error_message()
        if error_msg:
            view.unset_error_message()
            return json_message.create("danger", error_msg)

        sub_path = view.get_current_sub_path()
        files    = view.get_files_formatted()
        fave     = db.session.query(Favorites).filter_by(link = sub_path).first()
        in_fave  = "true" if fave else "false"
        files.update({'in_fave': in_fave})
        return files

    msg = "Can't manage the request type..."
    return json_message.create("danger", msg)


@app.route('/api/file-manager-action/<_type>/<_hash>', methods=['GET', 'POST'])
def file_manager_action(_type, _hash = None):
    view = get_view()

    if _type == "reset-path" and _hash == "None":
        view.set_to_home()
        msg = "Returning to home directory..."
        return json_message.create("success", msg)

    folder = view.get_current_directory()
    file   = view.get_path_part_from_hash(_hash)
    fpath  = os.path.join(folder, file)
    logger.debug(fpath)

    if _type == "files":
        logger.debug(f"Downloading:\n\tDirectory: {folder}\n\tFile: {file}")
        return send_from_directory(directory=folder, filename=file)

    if _type == "remux":
        remux_video(get_sse_id(), _hash, fpath, view)
        msg = "Remuxing: Remux process has started..."
        return json_message.create("success", msg)

    if _type == "stream":
        setup_stream(get_sse_id(), _hash, fpath)
        msg = "Streaming: Streaming process is being setup..."
        return json_message.create("success", msg)


    # NOTE: Positionally protecting actions further down that are privlidged
    #       Be aware of ordering!
    msg = "Log in with an Admin privlidged user to do this action!"
    if not oidc.user_loggedin:
        return json_message.create("danger", msg)
    elif oidc.user_loggedin:
        isAdmin = oidc.user_getfield("isAdmin")
        if isAdmin != "yes" :
            return json_message.create("danger", msg)


    if _type == "run-locally":
        msg = "Opened media..."
        view.open_file_locally(fpath)
        return json_message.create("success", msg)


@daemon_threaded
def remux_video(sse_id, hash, path, view):
    link = f"https://www.webfm.com/sse/{sse_id}"
    body = '{"path":"static/remuxs/' + hash + '.mp4"}'

    # good_result = view.remux_video(hash, path)
    good_result = view.handbrake_remux_video(hash, path)
    if not good_result:
        body = json_message.create("warning", "Remuxing: Remux failed...")

    requests.post(link, data=body, timeout=10)


def setup_stream(sse_id, hash, path):
    link           = f"https://www.webfm.com/sse/{sse_id}"
    _sub_uuid      = uuid.uuid4().hex
    _video_path    = path
    _stub          = f"{hash}{_sub_uuid}"
    _rtsp_path     = f"rtsp://127.0.0.1:8554/{_stub}"
    _webrtc_path   = f"http://www.{app_name.lower()}.com:8889/{_stub}/"
    _stream_target = _rtsp_path

    process = get_stream()
    if process:
        if not kill_stream(process):
            msg  = "Couldn't stop an existing stream!"
            body = json_message.create("danger", msg)
            requests.post(link, data=body, timeout=10)
            return

    stream = get_stream(_video_path, _stream_target)
    if stream.poll():
        msg  = "Streaming: Setting up stream failed! Please try again..."
        body = json_message.create("danger", msg)
        requests.post(link, data=body, timeout=10)
        return

    _stream_target = _webrtc_path
    body           = '{"stream":"' + _stream_target + '"}'
    requests.post(link, data=body, timeout=10)



@app.route('/api/stop-current-stream', methods=['GET', 'POST'])
def stop_current_stream():
    type    = "success"
    msg     = "Stopped found stream process..."
    process = get_stream()

    if process:
        if not kill_stream(process):
            type = "danger"
            msg  = "Couldn't stop an existing stream!"
    else:
        type = "warning"
        msg  = "No stream process found. Nothing to stop..."

    return json_message.create(type, msg)
