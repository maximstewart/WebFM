<?php

function openFile($FILE) {
    include 'config.php';

    if (preg_match('(.mkv|.avi|.flv|.mov|.m4v|.mpg|.wmv|.mpeg)', strtolower($FILE)) === 1) {
        shell_exec($MEDIAPLAYER . " \"" . $FILE . "\" &");
    } else if (preg_match('(.png|.jpg|.jpeg|.gif)', strtolower($FILE)) === 1) {
        shell_exec($IMGVIEWER . ' "' . $FILE . '" &');
    } else if (preg_match('(.psf|.mp3|.ogg|.flac)', strtolower($FILE)) === 1) {
        shell_exec($MUSICPLAYER . '  "' . $FILE . '" &');
    } else if (preg_match('(.txt)', strtolower($FILE)) === 1) {
        shell_exec($TEXTVIEWER . '  "' . $FILE . '" &');
    } else if (preg_match('(.pdf)', strtolower($FILE)) === 1) {
        shell_exec($PDFVIEWER . ' "' . $FILE . '" &');
    // Has to be below b/c pdf somehow regesters and an office app.... wtf....
    } else if (preg_match('(.odt|.doc|.docx|.rtf)', strtolower($FILE)) === 1) {
        shell_exec($OFFICEPROG . '  "' . $FILE . '" &');
    }
}


chdir("../../");
if (isset($_POST["media"])) {
    openFile($_POST["media"]);
}

?>
