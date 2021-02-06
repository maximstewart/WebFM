class Launcher:
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
