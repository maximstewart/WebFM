# Python imports
import json
import os
from os import path

# Lib imports

# Apoplication imports




class Settings:
    logger            = None
    USR_WEBFM         = "/usr/share/webfm"
    SHIM_PATH         = "/dev/shm/webfm"
    USER_HOME         = path.expanduser('~')
    CONFIG_PATH       = f"{USER_HOME}/.config/webfm"
    CONFIG_FILE       = f"{CONFIG_PATH}/settings.json"
    HIDE_HIDDEN_FILES = True

    GTK_ORIENTATION   = 1    # HORIZONTAL (0) VERTICAL (1)
    DEFAULT_ICONS     = f"{CONFIG_PATH}/icons"
    DEFAULT_ICON      = f"{DEFAULT_ICONS}/text.png"
    FFMPG_THUMBNLR    = f"{CONFIG_PATH}/ffmpegthumbnailer"    # Thumbnail generator binary
    BLENDER_THUMBNLR  = f"{CONFIG_PATH}/blender-thumbnailer"  # Blender thumbnail generator binary
    # REMUX_FOLDER      = f"{USER_HOME}/.remuxs"              # Remuxed files folder
    REMUX_FOLDER      = f"{SHIM_PATH}/.remuxs"                # Remuxed files folder

    ICON_DIRS         = ["/usr/share/icons", f"{USER_HOME}/.icons" "/usr/share/pixmaps"]
    # BASE_THUMBS_PTH   = f"{USER_HOME}/.thumbnails"       # Used for thumbnail generation
    BASE_THUMBS_PTH   = f"{SHIM_PATH}/.thumbnails"         # Used for thumbnail generation
    ABS_THUMBS_PTH    = f"{BASE_THUMBS_PTH}/normal"        # Used for thumbnail generation
    STEAM_ICONS_PTH   = f"{BASE_THUMBS_PTH}/steam_icons"

    # Dir structure check
    if not path.isdir(SHIM_PATH):
        os.mkdir(SHIM_PATH)

    if not path.isdir(REMUX_FOLDER):
        os.mkdir(REMUX_FOLDER)

    if not path.isdir(BASE_THUMBS_PTH):
        os.mkdir(BASE_THUMBS_PTH)

    if not path.isdir(ABS_THUMBS_PTH):
        os.mkdir(ABS_THUMBS_PTH)

    if not path.isdir(STEAM_ICONS_PTH):
        os.mkdir(STEAM_ICONS_PTH)

    if not os.path.exists(DEFAULT_ICONS):
        DEFAULT_ICONS = f"{USR_WEBFM}/icons"
        DEFAULT_ICON  = f"{DEFAULT_ICONS}/text.png"

    with open(CONFIG_FILE) as f:
        settings          = json.load(f)
        config            = settings["config"]

        subpath           = config["base_of_home"]
        STEAM_CDN_URL     = config["steam_cdn_url"]
        FFMPG_THUMBNLR    = FFMPG_THUMBNLR   if config["thumbnailer_path"] == "" else config["thumbnailer_path"]
        BLENDER_THUMBNLR  = BLENDER_THUMBNLR if config["blender_thumbnailer_path"] == "" else config["blender_thumbnailer_path"]
        HIDE_HIDDEN_FILES = True  if config["hide_hidden_files"] in ["true", ""] else False
        go_past_home      = True  if config["go_past_home"] in ["true", ""] else False
        lock_folder       = False if config["lock_folder"] in ["false", ""] else True
        locked_folders    = config["locked_folders"].split("::::")
        mplayer_options   = config["mplayer_options"].split()
        music_app         = config["music_app"]
        media_app         = config["media_app"]
        image_app         = config["image_app"]
        office_app        = config["office_app"]
        pdf_app           = config["pdf_app"]
        code_app          = config["code_app"]
        text_app          = config["text_app"]
        terminal_app      = config["terminal_app"]
        container_icon_wh = config["container_icon_wh"]
        video_icon_wh     = config["video_icon_wh"]
        sys_icon_wh       = config["sys_icon_wh"]
        file_manager_app  = config["file_manager_app"]
        remux_folder_max_disk_usage = config["remux_folder_max_disk_usage"]

        # Filters
        filters = settings["filters"]
        fcode   = tuple(filters["code"])
        fvideos = tuple(filters["videos"])
        foffice = tuple(filters["office"])
        fimages = tuple(filters["images"])
        ftext   = tuple(filters["text"])
        fmusic  = tuple(filters["music"])
        fpdf    = tuple(filters["pdf"])
