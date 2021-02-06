# Python imports
from os.path import isdir, isfile, join
from os import listdir


# Lib imports

# Application imports
from . import Path, Filters


class View(Filters, Path):
    def __init__(self):
        self.hideHiddenFiles = True
        self.files     = []
        self.dirs      = ['.', '..']
        self.vids      = []
        self.images    = []
        self.desktop   = []
        self.ungrouped = []

        self.set_to_home()


    def load_directory(self):
        path           = self.get_path()
        self.dirs      = ['.', '..']
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
            if self.hideHiddenFiles:
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


    def get_files(self):
        return self.files

    def get_dirs(self):
        return self.dirs

    def get_videos(self):
        return self.vids

    def get_images(self):
        return self.images

    def get_desktops(self):
        return self.desktop

    def get_ungrouped(self):
        return self.ungrouped
