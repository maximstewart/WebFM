<?php
    $MEDIAPLAYER     = "mpv ";
    $MPLAYER_WH      = " -xy 1600 -geometry 50%:50% ";
    $MUSICPLAYER     = "/opt/deadbeef/bin/deadbeef";
    $IMGVIEWER       = "mirage";
    $OFFICEPROG      = "libreoffice";
    $PDFVIEWER       = "evince";
    $TEXTVIEWER      = "leafpad";
    $FILEMANAGER     = "spacefm";
    $LOCKPASSWORD    = "1234";
    $TMPFOLDERSIZE   = 8000; // tmp folder size check for cleanup if above 8GB used.
    $UNLOCKTIME      = 80;  // Every ~3 sec this ticks down
                            // Ex: 3*60 == 180 sec or 3 minutes
    // NOTE:  Split folders with ::::
    $LOCKEDFOLDERS   = "./dirLockCheck/";

?>
