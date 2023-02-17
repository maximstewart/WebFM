# Python imports
import os
import builtins
import threading
import re
import secrets
import subprocess

# Lib imports
from flask import session

# Application imports
from core import app
from core.utils import Logger
from core.utils import MessageHandler       # Get simple message processor


class BuiltinsException(Exception):
    ...


# NOTE: Threads WILL NOT die with parent's destruction.
def threaded_wrapper(fn):
    def wrapper(*args, **kwargs):
        threading.Thread(target=fn, args=args, kwargs=kwargs, daemon=False).start()
    return wrapper

# NOTE: Threads WILL die with parent's destruction.
def daemon_threaded_wrapper(fn):
    def wrapper(*args, **kwargs):
        threading.Thread(target=fn, args=args, kwargs=kwargs, daemon=True).start()
    return wrapper

def sizeof_fmt_def(num, suffix="B"):
    for unit in ["", "K", "M", "G", "T", "Pi", "Ei", "Zi"]:
        if abs(num) < 1024.0:
            return f"{num:3.1f} {unit}{suffix}"
        num /= 1024.0
    return f"{num:.1f} Yi{suffix}"


def _get_file_size(file):
    return "4K" if isdir(file) else sizeof_fmt_def(os.path.getsize(file))



# NOTE: Just reminding myself we can add to builtins two different ways...
# __builtins__.update({"event_system": Builtins()})
builtins.app_name        = "WebFM"
builtins.threaded        = threaded_wrapper
builtins.daemon_threaded = daemon_threaded_wrapper
builtins.sizeof_fmt      = sizeof_fmt_def
builtins.get_file_size   = _get_file_size
builtins.ROOT_FILE_PTH   = os.path.dirname(os.path.realpath(__file__))
builtins.BG_IMGS_PATH    = ROOT_FILE_PTH + "/static/imgs/backgrounds/"
builtins.BG_FILE_TYPE    = (".webm", ".mp4", ".gif", ".jpg", ".png", ".webp")
builtins.valid_fname_pat = re.compile(r"[a-z0-9A-Z-_\[\]\(\)\| ]{4,20}")
builtins.logger          = Logger().get_logger()
builtins.json_message    = MessageHandler()



# NOTE: Need threads defined before instantiating

def _start_rtsp_server():
    PATH    = f"{ROOT_FILE_PTH}/utils/rtsp-server"
    RAMFS   = "/dev/shm/webfm"
    SYMLINK = f"{PATH}/m3u8_stream_files"

    if not os.path.exists(PATH) or not os.path.exists(f"{PATH}/rtsp-simple-server"):
        msg = f"\n\nAlert: Reference --> https://github.com/aler9/rtsp-simple-server/releases" + \
                f"\nPlease insure {PATH} exists and rtsp-simple-server binary is there.\n\n"
        raise BuiltinsException(msg)

    if not os.path.exists(RAMFS):
        os.mkdir(RAMFS)
    if not os.path.exists(f"{PATH}/m3u8_stream_files"):
        os.symlink(RAMFS, SYMLINK)

    @daemon_threaded
    def _start_rtsp_server_threaded():
        os.chdir(PATH)
        command = ["./rtsp-simple-server", "./rtsp-simple-server.yml"]
        process = subprocess.Popen(command)
        process.wait()

    _start_rtsp_server_threaded()

_start_rtsp_server()



from core.utils.shellfm.windows.controller import WindowController    # Get file manager controller
window_controllers = {}
processes = {}

def _get_view():
    controller = None
    try:
        controller = window_controllers[ session["win_controller_id"]  ].get_window_by_index(0).get_tab_by_index(0)
    except Exception as e:
        id         = secrets.token_hex(16)
        controller = WindowController()
        view       = controller.create_window().create_tab()

        try:
            view.ABS_THUMBS_PTH = app.config['ABS_THUMBS_PTH']
        except Exception as e:
            print("No ABS_THUMBS_PTH set by WebFM...")

        try:
            view.REMUX_FOLDER   = app.config['REMUX_FOLDER']
        except Exception as e:
            print("No REMUX_FOLDER  set by WebFM...")

        try:
            view.FFMPG_THUMBNLR = app.config['FFMPG_THUMBNLR']
        except Exception as e:
            print("No FFMPG_THUMBNLR set by WebFM...")

        view.logger         = logger

        session['win_controller_id'] = id
        window_controllers.update( {id: controller} )
        controller = window_controllers[ session["win_controller_id"]  ].get_window_by_index(0).get_tab_by_index(0)

    return controller


def _get_stream(video_path=None, stream_target=None):
    process = None
    try:
        window  = window_controllers[ session["win_controller_id"]  ].get_window_by_index(0)
        tab     = window.get_tab_by_index(0)
        id      = f"{window.get_id()}{tab.get_id()}"
        process = processes[id]
    except Exception as e:
        if video_path and stream_target:
            # NOTE: Yes, technically we should check if cuda is supported.
            #       Yes, the process probably should give us info we can process when failure occures.
            command = [
                "ffmpeg", "-nostdin", "-fflags", "+genpts", "-hwaccel", "cuda",
                "-stream_loop", "1", "-i", video_path, "-strict", "experimental",
                "-vcodec", "copy", "-acodec", "copy", "-f", "rtsp",
                "-rtsp_transport", "udp", stream_target
            ]

            # command = [
            #     "ffmpeg", "-nostdin", "-fflags", "+genpts", "-i", video_path,
            #     "-strict", "experimental", "-f",
            #     "rtsp", "-rtsp_transport", "udp", stream_target
            # ]

            proc   = subprocess.Popen(command, shell=False, stdin=None, stdout=None, stderr=None)
            window = window_controllers[ session["win_controller_id"]  ].get_window_by_index(0)
            tab    = window.get_tab_by_index(0)
            id     = f"{window.get_id()}{tab.get_id()}"

            processes.update( {id: proc} )
            process = processes[id]

    return process

def _kill_stream(process):
    try:
        if process.poll() == None:
            process.terminate()
            while process.poll() == None:
                ...

        window  = window_controllers[ session["win_controller_id"]  ].get_window_by_index(0)
        tab     = window.get_tab_by_index(0)
        id      = f"{window.get_id()}{tab.get_id()}"
        del processes[id]
    except Exception as e:
        return False

    return True



builtins.get_view    = _get_view
builtins.get_stream  = _get_stream
builtins.kill_stream = _kill_stream
