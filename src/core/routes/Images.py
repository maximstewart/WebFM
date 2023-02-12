# Python imports
import os
import requests
import shutil

# Lib imports
from flask import request

# App imports
                                            # Get from __init__
from core import app
from core.utils.tmdbscraper import scraper  # Get media art scraper



tmdb = scraper.get_tmdb_scraper()



@app.route('/api/get-background-poster-trailer', methods=['GET', 'POST'])
def getPosterTrailer():
    if request.method == 'GET':
        info     = {}
        view     = get_view()
        dot_dots = view.get_dot_dots()

        sub_path = view.get_current_sub_path()
        file     = sub_path.split("/")[-1]
        trailer           = None
        if "(" in file and ")" in file:
            title          = file.split("(")[0].strip()
            startIndex     = file.index('(') + 1
            endIndex       = file.index(')')
            date           = file[startIndex:endIndex]

            try:
                video_data     = tmdb.search(title, date)[0]
                video_id       = video_data["id"]
                background_url = video_data["backdrop_path"]
                background_pth = f"{view.get_current_directory()}/000.jpg"

                tmdb_videos = tmdb.tmdbapi.get_movie(str(video_id), append_to_response="videos")["videos"]["results"]
                for tmdb_video in tmdb_videos:
                    if "YouTube" in tmdb_video["site"]:
                        trailer_key = tmdb_video["key"]
                        trailer     = f"https://www.youtube-nocookie.com/embed/{trailer_key}?start=0&autoplay=1";

                if not trailer:
                    raise Exception("No key found. Defering to none...")
            except Exception as e:
                print("No trailer found...")
                trailer = None

            if not os.path.isfile(background_pth):
                r = requests.get(background_url, stream = True)

                if r.status_code == 200:
                    r.raw.decode_content = True
                    with open(background_pth,'wb') as f:
                        shutil.copyfileobj(r.raw, f)

                    view.load_directory()
                    print('Cover Background Image sucessfully retreived...')
                else:
                    print('Cover Background Image Couldn\'t be retreived...')

            info.update({'trailer': trailer})
            info.update({'poster': background_url})

        return info


@app.route('/backgrounds', methods=['GET', 'POST'])
def backgrounds():
    files = []
    data  = os.listdir(BG_IMGS_PATH)
    for file in data:
        if file.lower().endswith(BG_FILE_TYPE):
            files.append(file)

    return json_message.backgrounds(files)

@app.route('/api/get-thumbnails', methods=['GET', 'POST'])
def getThumbnails():
    if request.method == 'GET':
        view   = get_view()
        return json_message.thumbnails( view.get_video_icons() )
    else:
        msg = "Can't manage the request type..."
        return json_message.create("danger", msg)
