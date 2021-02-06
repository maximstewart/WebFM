# Python imports
import os

# Lib imports

# Application imports


class Path:
    def get_path(self):
        return "/" + "/".join(self.path)

    def get_path_list(self):
        return self.path

    def push_to_path(self, dir):
        self.path.append(dir)
        self.load_directory()

    def pop_from_path(self):
        self.path.pop()
        self.load_directory()

    def set_path(self, path):
        self.path = list( filter(None, path.replace("\\", "/").split('/')) )
        self.load_directory()

    def set_to_home(self):
        home = os.path.expanduser("~")
        path = list( filter(None, home.replace("\\", "/").split('/')) )
        self.path = path
        self.load_directory()
