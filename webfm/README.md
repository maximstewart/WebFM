# WebFM
WebFM is a media and file viewer aspiring to become a full fledged file manager in the browser.


# Setup
1. Install python3, and ffmpeg on the system this will be on.
2. Create a "venv" folder in the WebFM folder where start.sh is.
3. Source activate it and pip install the requirements.txt file.
4. Use ufw or gufw to open the port on your computer to the network.
5. Edit webfm.db to add your "base_path" directory in the settings table. (You can use SQliteBrowser.)
6. Edit the WebFM/webfm/config.json file and put your own programs there.


# Usage
1. Double click thumbnails and container outlines to open files.
2. (Needs to be added back in.) Double click the text name to change the file's or folder's name and press enter to set it.
3. Right-click to get context menu options.
4. Place an image such as a jpg, png, or gif labeled "000.itsExtensionType" in a directory then the viewer will use it as the background image for that folder/directory.
5. Password protect folder based on WebFM/webfm/config.json file setting.
6. Save paths to favorites list for quick access. (Star icon on the interface.)


# TO-DO
1. Allow for move and copy.
2. Implement themes functionality.


# Images
![1 Home](Images/pic1.png)
![2 Images Listed](Images/pic2.png)
![3 Videos Listed](Images/pic3.png)
![4 Image Open](Images/pic4.png)
![5 Image Open And Video Playing](Images/pic5.png)
![6 Alternate Background](Images/pic6.png)
