# System import
import json
from os import path


# Lib imports


# Apoplication imports



class Settings:
    ABS_THUMBS_PTH = None   # Used for thumbnail generation and is set by passing in
    REMUX_FOLDER   = None   # Used for Remuxed files and is set by passing in
    FFMPG_THUMBNLR = None   # Used for thumbnail generator binary and is set by passing in

    CONFIG_FILE    = path.dirname(__file__) + '/webfm_config.json'
    subpath        = "/LazyShare"  # modify 'home' folder path

    fvideos = ('.mkv', '.avi', '.flv', '.mov', '.m4v', '.mpg', '.wmv', '.mpeg', '.mp4', '.webm')
    foffice = ('.doc', '.docx', '.xls', '.xlsx', '.xlt', '.xltx', '.xlm', '.ppt', 'pptx', '.pps', '.ppsx', '.odt', '.rtf')
    fimages = ('.png', '.jpg', '.jpeg', '.gif', '.ico', '.tga')
    ftext   = ('.txt', '.text', '.sh', '.cfg', '.conf')
    fmusic  = ('.psf', '.mp3', '.ogg', '.flac', '.m4a')
    fpdf    = ('.pdf')
