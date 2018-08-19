# WebFM
WebFM is a media and file viewer aspiring to become a full fledged file manager in the browser.

# Usage
1. Install php7 and ffmpeg on the system this will be on.
2. Use php -S 0.0.0.0:yourDesiredPort
3. Use ufw or gufw to open the port on your computer to the network.
4. Place files or start uploading some to the folders.
5. Double click thumbnails and container outlines to open files.
6. Double click the text name to change the file's or folder's name and press enter to set it.
7. Right-click to get context menu options.
8. Place an image such as a jpg, png, or gif labeled "000.itsExtension" in a directory then the viewer will use it as the background image for that folder/directory.
9. Password protect folder based on resources/php/config.php file setting.

Notes:
1. Folders and files CAN NOT have & in the names. Otherwise, you can't access that item with the viewer.
3. The provided folders except "resources" are optional. You can add and remove them as you please.
4. The media and image pane can be moved by dragging from the transparentish bar that has the close button and other controls.
5. Edit the resources/php/config.php file and put your own programs there.
6. Edit your php.ini file "upload_max_filesize" and "post_max_size" to be higher to upload larger files.

# TO-DO
1. Allow for move and copy.
3. Fix & problem.
4. Implement themes functionality.


# Images
![1 Home](Images/1.png)
![2 Images Listed](Images/2.png)
![3 Image Open](Images/3.png)
![4 Image Open And Video Playing](Images/4.png)
![5 Alternate Background](Images/5.png)
