# WebFM
WebFM is a media and file viewer aspiring to become a full fledged file manager in the browser.

# Usage
1. Install python, sqlite3, and ffmpeg on the system this will be on.
3. Use ufw or gufw to open the port on your computer to the local network.
4. Use hosts file (or other methods) to redirect webfm.com and ssoapps.com to local app.
5. Update client_secrets.json > 'client_secret' field with your Keycloak key. (Current one is local to me and not public)
6. Place files or start uploading some to the folders.
7. Place an image such as a jpg, png, or gif labeled "000.itsExtension" in a directory and the viewer will use it as the background image for that folder/directory.
7. Password protect folder based on core/utils/shellfm/windows/Settings.py file settings.
8. Save paths to favorites list for quick access.

Notes:
n/a

# TO-DO
1. Allow for move and copy.
2. Implement themes functionality.


# Images
![1 Videos List](images/pic1.png)
![2 Video Playing](images/pic2.png)
![3 Images List](images/pic3.png)
