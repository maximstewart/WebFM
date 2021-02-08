# Python imports
import hashlib
from os import listdir
from os.path import isdir, isfile, join


# Lib imports


# Application imports
from . import Path, Settings, Launcher


class View(Settings, Launcher, Path):
    def __init__(self):
        self.files     = []
        self.dirs      = []
        self.vids      = []
        self.images    = []
        self.desktop   = []
        self.ungrouped = []

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
            self.set_to_home()
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

        self.dirs.sort()
        self.vids.sort()
        self.images.sort()
        self.desktop.sort()
        self.ungrouped.sort()

        self.files = self.dirs + self.vids + self.images + self.desktop + self.ungrouped

    def hashText(self, text):
        return hashlib.sha256(str.encode(text)).hexdigest()[:18]

    def hashSet(self, arry):
        data = []
        for arr in arry:
            data.append([arr, self.hashText(arr)])
        return data

    def get_path_part_from_hash(self, hash):
        files = self.get_files()
        for file in files:
            if hash == file[1]:
                return file[0]
        return None

    def get_files_formatted(self):
        files     = self.hashSet(self.files),
        dirs      = self.hashSet(self.dirs),
        videos    = self.hashSet(self.vids),
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


    def get_current_directory(self):
        return self.get_path()

    def get_dot_dots(self):
        return self.hashSet(['.', '..'])

    def get_files(self):
        return self.hashSet(self.files)

    def get_dirs(self):
        return self.hashSet(self.dirs)

    def get_videos(self):
        return self.hashSet(self.vids)

    def get_images(self):
        return self.hashSet(self.images)

    def get_desktops(self):
        return self.hashSet(self.desktop)

    def get_ungrouped(self):
        return self.hashSet(self.ungrouped)
