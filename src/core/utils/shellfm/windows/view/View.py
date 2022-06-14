# Python imports
import hashlib, os, re
from os import listdir
from os.path import isdir, isfile, join


# Lib imports


# Application imports
from .utils import Settings, Launcher
from . import Path

class View(Settings, Launcher, Path):
    def __init__(self):
        self.files     = []
        self.dirs      = []
        self.vids      = []
        self.images    = []
        self.desktop   = []
        self.ungrouped = []
        self.error_message = None

        self.set_to_home()

    def load_directory(self):
        path           = self.get_path()
        self.dirs      = []
        self.vids      = []
        self.images    = []
        self.desktop   = []
        self.ungrouped = []
        self.files     = []

        if not isdir(path):
            self._set_error_message("Path can not be accessed.")
            return ""

        for f in listdir(path):
            file = join(path, f)
            if self.HIDE_HIDDEN_FILES:
                if f.startswith('.'):
                    continue

            if isfile(file):
                lowerName = file.lower()
                if lowerName.endswith(self.fvideos):
                    self.vids.append(f)
                elif lowerName.endswith(self.fimages):
                    self.images.append(f)
                elif lowerName.endswith((".desktop",)):
                    self.desktop.append(f)
                else:
                    self.ungrouped.append(f)
            else:
                self.dirs.append(f)

        self.dirs.sort(key=self._natural_keys)
        self.vids.sort(key=self._natural_keys)
        self.images.sort(key=self._natural_keys)
        self.desktop.sort(key=self._natural_keys)
        self.ungrouped.sort(key=self._natural_keys)

        self.files = self.dirs + self.vids + self.images + self.desktop + self.ungrouped

    def hashText(self, text):
        return hashlib.sha256(str.encode(text)).hexdigest()[:18]

    def hashSet(self, arry):
        path = self.get_path()
        data = []
        for arr in arry:
            file = f"{path}/{arr}"
            size = "4K" if isdir(file) else self.sizeof_fmt(os.path.getsize(file))
            data.append([arr, self.hashText(arr), size])
        return data

    def get_path_part_from_hash(self, hash):
        files = self.get_files()
        file  = None

        for f in files:
            if hash == f[1]:
                file = f[0]
                break

        return file

    def get_files_formatted(self):
        files     = self.hashSet(self.files),
        dirs      = self.hashSet(self.dirs),
        videos    = self.get_videos(),
        images    = self.hashSet(self.images),
        desktops  = self.hashSet(self.desktop),
        ungrouped = self.hashSet(self.ungrouped)

        return {
            'path_head': self.get_path(),
            'list': {
                'files': files,
                'dirs': dirs,
                'videos': videos,
                'images': images,
                'desktops': desktops,
                'ungrouped': ungrouped
            }
        }

    def is_folder_locked(self, hash):
        if self.lock_folder:
            path_parts = self.get_path().split('/')
            file       = self.get_path_part_from_hash(hash)

            # Insure chilren folders are locked too.
            lockedFolderInPath = False
            for folder in self.locked_folders:
                if folder in path_parts:
                    lockedFolderInPath = True
                    break

            return (file in self.locked_folders or lockedFolderInPath)
        else:
            return False


    def _set_error_message(self, text):
        self.error_message = text

    def unset_error_message(self):
        self.error_message = None

    def get_error_message(self):
        return self.error_message

    def get_current_directory(self):
        return self.get_path()

    def get_current_sub_path(self):
        path = self.get_path()
        home = self.get_home() + "/"
        return path.replace(home, "")

    def get_dot_dots(self):
        return self.hashSet(['.', '..'])

    def get_files(self):
        return self.hashSet(self.files)

    def get_dirs(self):
        return self.hashSet(self.dirs)

    def get_videos(self):
        videos_set        = self.hashSet(self.vids)
        current_directory = self.get_current_directory()
        for video in videos_set:
            hashImgPth = join(self.ABS_THUMBS_PTH, video[1]) + ".jpg"
            if not os.path.exists(hashImgPth) :
                fullPath = join(current_directory, video[0])
                self.logger.debug(f"Hash Path: {hashImgPth}\nFile Path: {fullPath}")
                self.generate_video_thumbnail(fullPath, hashImgPth)

        return videos_set

    def get_images(self):
        return self.hashSet(self.images)

    def get_desktops(self):
        return self.hashSet(self.desktop)

    def get_ungrouped(self):
        return self.hashSet(self.ungrouped)

    def sizeof_fmt(self, num, suffix="B"):
        for unit in ["", "K", "M", "G", "T", "Pi", "Ei", "Zi"]:
            if abs(num) < 1024.0:
                return f"{num:3.1f} {unit}{suffix}"
            num /= 1024.0
        return f"{num:.1f} Yi{suffix}"

    def get_dir_size(self, sdir):
        """Get the size of a directory.  Based on code found online."""
        size = os.path.getsize(sdir)

        for item in listdir(sdir):
            item = join(sdir, item)

            if isfile(item):
                size = size + os.path.getsize(item)
            elif isdir(item):
                size = size + self.get_dir_size(item)

        return size


    def _atoi(self, text):
        return int(text) if text.isdigit() else text

    def _natural_keys(self, text):
        return [ self._atoi(c) for c in re.split('(\d+)',text) ]
