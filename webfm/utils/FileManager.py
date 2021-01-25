# Gtk imports

# Python imports
import os, subprocess, hashlib, threading

from os.path import isdir, isfile, join
from os import listdir


# Application imports
from .Logger import Logger
from .. import app, config



class FileManager:
    def __init__(self, _db, _Settings):
        self.db             = _db
        self.SettingsDBObj  = _Settings
        self.logging        = Logger().get_logger("FileManager")

        self.THIS_FILE_PTH  = os.path.dirname(os.path.realpath(__file__))
        self.STATIC_FPTH    = self.THIS_FILE_PTH + "/../static"
        self.REMUX_FOLDER   = self.STATIC_FPTH + "/remuxs"
        self.FFMPG_THUMBNLR = self.STATIC_FPTH + "/ffmpegthumbnailer"
        self.VEXTENSION     = ('.mkv', '.avi', '.flv', '.mov', '.m4v', '.mpg', '.wmv', '.mpeg', '.mp4', '.webm')
        self.OEXTENSION     = ('.doc', '.docx', '.xls', '.xlsx', '.xlt', '.xltx', '.xlm', '.ppt', 'pptx', '.pps', '.ppsx', '.odt', '.rtf')
        self.IEXTENSION     = ('.png', '.jpg', '.jpeg', '.gif', '.ico', '.tga')
        self.TEXTENSION     = ('.txt', '.text', '.sh', '.cfg', '.conf')
        self.MEXTENSION     = ('.psf', '.mp3', '.ogg', '.flac', '.m4a')
        self.PEXTENSION     = ('.pdf')

        self.dotHash        = self.hashText(".")
        self.dotdotHash     = self.hashText("..")
        self.pathParts      = []
        self.pathPartHashs  = []
        self.dirs           = []
        self.vids           = []
        self.images         = []
        self.files          = []

        self.loadPreviousPath()
        self.generateLists(self.dotHash)


    def generateLists(self, partHash, showHiddenFiles = False):
        path = self.determinAction(partHash)
        if "error" in path:
            return path

        self.dirs.clear()
        self.vids.clear()
        self.images.clear()
        self.files.clear()

        for f in listdir(path):
            file     = join(path, f)
            fileHash = self.hashText(f)

            if f.startswith('.') and not showHiddenFiles:
                continue

            if isfile(file):
                if file.lower().endswith(self.VEXTENSION):
                    absHashImgPth = self.STATIC_FPTH + "/imgs/thumbnails/" + fileHash + ".jpg"
                    hashImgPth = "static/imgs/thumbnails/" + fileHash + ".jpg"

                    if isfile(absHashImgPth) == False:
                        self.generateVideoThumbnail(file, absHashImgPth)

                    self.vids.append([f, hashImgPth, fileHash])
                elif file.lower().endswith(self.IEXTENSION):
                    self.images.append([f, fileHash])
                else:
                    self.files.append([f, fileHash])
            else:
                self.dirs.append([f, fileHash])

        self.dirs.sort()
        self.vids.sort()
        self.images.sort()
        self.files.sort()

        return "success"


    def determinAction(self, partHash):
        pathPart      = self.returnPathPartFromHash(partHash)
        isDotorDotDot = False

        if self.isDotHash(partHash) or self.isDotDotHash(partHash):
            isDotorDotDot = True

        # If hash not in dir hashes prob bad path or data...
        if not pathPart and not isDotorDotDot:
            return "error"

        # Pop from stack if .. and not length 1
        if partHash in self.dotdotHash:
            if len(self.pathParts) > 1 and len(self.pathPartHashs) > 1:
                self.pathParts.pop()
                self.pathPartHashs.pop()

        # Append to our stacks if not . or ..
        if not isDotorDotDot:
            self.pathParts.append(pathPart)
            self.pathPartHashs.append(partHash)

        # Get path parts excluding base path...
        with app.app_context():
            current_path_hash = self.db.session.query(self.SettingsDBObj).filter_by(key="current_path_hash").first()

            size = len(self.pathPartHashs)
            if size > 0: # If 0 or less then we have 0 or 1 slot (IE base path or none)
                current_path_hash.value = "/".join(self.pathPartHashs[1:size] )

            current_path = self.db.session.query(self.SettingsDBObj).filter_by(key="current_path").first()
            size = len(self.pathParts)
            if size > 0: # If 0 or less then we have 0 or 1 slot (IE base path or none)
                current_path.value = "/".join(self.pathParts[1:size])

            self.db.session.commit()

        return "/".join(self.pathParts)


    def returnPathPartFromHash(self, partHash):
        hashes   = [self.dotHash, self.dotdotHash]
        path     = "/".join(self.pathParts)
        pathPart = None
        for f in listdir(path):
            hash = self.hashText(f)

            if partHash == hash:
                pathPart = f
                break

        return pathPart


    def loadPreviousPath(self):
        with app.app_context():
            basePath          = self.db.session.query(self.SettingsDBObj).filter_by(key="base_path").first()
            basePathHash      = self.hashText(basePath.value)
            self.pathParts.append(basePath.value)
            self.pathPartHashs.append(basePathHash)

            # TODO: Need to tie current path to a user or session instead of this
            # current_path = self.db.session.query(self.SettingsDBObj).filter_by(key="current_path").first()
            current_path = self.db.session.query(self.SettingsDBObj).filter_by(key="current_path").first()
            if current_path.value and not "NULL" in current_path.value:
                parts = current_path.value.split("/")
                for part in parts:
                    self.pathParts.append(part)

            current_path_hash = self.db.session.query(self.SettingsDBObj).filter_by(key="current_path_hash").first()
            if current_path_hash.value and not "NULL" in current_path_hash.value:
                parts = current_path_hash.value.split("/")
                for part in parts:
                    self.pathPartHashs.append(part)

    def setNewPathFromFavorites(self, path):
        with app.app_context():
            current_path       = self.db.session.query(self.SettingsDBObj).filter_by(key="current_path").first()
            current_path_hash  = self.db.session.query(self.SettingsDBObj).filter_by(key="current_path_hash").first()
            current_path.value = path
            parts              = path.split("/")
            hashParts          = []

            while len(self.pathParts) >= 1 and len(self.pathPartHashs) >= 1:
                self.pathParts.pop()
                self.pathPartHashs.pop()

            for part in parts:
                hash = self.hashText(part)
                hashParts.append(hash)

            size = len(hashParts)
            current_path_hash.value = "/".join(hashParts[0:size])
            self.db.session.commit()


    def reset_path(self):
        while len(self.pathParts) > 1 and len(self.pathPartHashs) > 1:
            self.pathParts.pop()
            self.pathPartHashs.pop()


    def isDotHash(self, hash):
        return True if self.dotHash == hash else False
    def isDotDotHash(self, hash):
        return True if self.dotdotHash == hash else False
    def getPath(self):
        size = len(self.pathParts)
        return "/".join(self.pathParts[1:size])
    def getFullPath(self):
        size = len(self.pathParts)
        return "/".join(self.pathParts[0:size])
    def getDirs(self):
        return self.dirs
    def getVids(self):
        return self.vids
    def getImgs(self):
        return self.images
    def getFiles(self):
        return self.files
    def getDotHash(self):
        return self.dotHash
    def getDotDotHash(self):
        return self.dotdotHash
    def hashText(self, text):
        return hashlib.sha256(str.encode(text)).hexdigest()[:18]

    def openFilelocally(self, file):
        lowerName = file.lower()
        command   = []

        if lowerName.endswith(self.VEXTENSION):
            player  = config["settings"]["media_app"]
            options = config["settings"]["mplayer_options"].split()
            command = [player]

            if "mplayer" in player:
                command += options

            command += [file]
        elif lowerName.endswith(self.IEXTENSION):
            command = [config["settings"]["image_app"], file]
        elif lowerName.endswith(self.MEXTENSION):
            command = [config["settings"]["music_app"], file]
        elif lowerName.endswith(self.OEXTENSION):
            command = [config["settings"]["office_app"], file]
        elif lowerName.endswith(self.TEXTENSION):
            command = [config["settings"]["text_app"], file]
        elif lowerName.endswith(self.PEXTENSION):
            command = [config["settings"]["pdf_app"], file]
        else:
            command = [config["settings"]["file_manager_app"], file]

        self.logging.debug(command)
        DEVNULL = open(os.devnull, 'w')
        subprocess.Popen(command, start_new_session=True, stdout=DEVNULL, stderr=DEVNULL, close_fds=True)


    def remuxVideo(self, hash, file):
        remux_vid_pth = self.REMUX_FOLDER + "/" + hash + ".mp4"
        message       = '{"path":"static/remuxs/' + hash + '.mp4"}'

        self.logging.debug(remux_vid_pth)
        self.logging.debug(message)

        if not os.path.isfile(remux_vid_pth):
            limit = config["settings"]["remux_folder_max_disk_usage"]
            try:
                limit = int(limit)
            except Exception as e:
                self.logging.debug(e)
                return

            usage = self.getRemuxFolderUsage(self.REMUX_FOLDER)
            if usage > limit:
                files = os.listdir(self.REMUX_FOLDER)
                for file in files:
                    fp = os.path.join(self.REMUX_FOLDER, file)
                    os.unlink(fp)

            command = ["ffmpeg", "-i", file, "-hide_banner", "-movflags", "+faststart"]
            if file.endswith("mkv"):
                command += ["-codec", "copy", "-strict", "-2"]
            if file.endswith("avi"):
                command += ["-c:v", "libx264", "-crf", "21", "-c:a", "aac", "-b:a", "192k", "-ac", "2"]
            if file.endswith("wmv"):
                command += ["-c:v", "libx264", "-crf", "23", "-c:a", "aac", "-strict", "-2", "-q:a", "100"]
            if file.endswith("f4v") or file.endswith("flv"):
                command += ["-vcodec", "copy"]

            command += [remux_vid_pth]
            try:
                proc = subprocess.Popen(command)
                proc.wait()
            except Exception as e:
                message = '{"message": {"type": "danger", "text":"' + str( repr(e) ) + '"}}'
                self.logging.debug(message)
                self.logging.debug(e)

        return message


    def generateVideoThumbnail(self, fullPath, hashImgPth):
        try:
            proc = subprocess.Popen([self.FFMPG_THUMBNLR, "-t", "65%", "-s", "300", "-c", "jpg", "-i", fullPath, "-o", hashImgPth])
            proc.wait()
        except Exception as e:
            self.logging.debug(repr(e))

    def getRemuxFolderUsage(self, start_path = "."):
        total_size = 0
        for dirpath, dirnames, filenames in os.walk(start_path):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                # skip if it is symbolic link
                if not os.path.islink(fp):
                    total_size += os.path.getsize(fp)

        return total_size
