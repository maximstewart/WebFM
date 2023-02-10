# Python imports
import os
import builtins
import threading
import re
import secrets

# Lib imports
from flask import session

# Application imports
from core import app
from core.utils import Logger



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
builtins.app_name          = "WebFM"
builtins.threaded          = threaded_wrapper
builtins.daemon_threaded   = daemon_threaded_wrapper
builtins.sizeof_fmt        = sizeof_fmt_def
builtins.get_file_size     = _get_file_size
builtins.ROOT_FILE_PTH     = os.path.dirname(os.path.realpath(__file__))
builtins.BG_IMGS_PATH      = ROOT_FILE_PTH + "/static/imgs/backgrounds/"
builtins.BG_FILE_TYPE      = (".webm", ".mp4", ".gif", ".jpg", ".png", ".webp")
builtins.valid_fname_pat   = re.compile(r"[a-z0-9A-Z-_\[\]\(\)\| ]{4,20}")
builtins.logger            = Logger().get_logger()



# NOTE: Need threads defined befor instantiating
from core.utils.shellfm.windows.controller import WindowController    # Get file manager controller
window_controllers = {}
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
        window_controllers.update( {id: controller } )
        controller = window_controllers[ session["win_controller_id"]  ].get_window_by_index(0).get_tab_by_index(0)

    return controller



builtins.get_view = _get_view
