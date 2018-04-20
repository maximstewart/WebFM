<?php

function openFile($FILE) {
    include 'config.php';
    $EXTNSN = strtolower(pathinfo($FILE, PATHINFO_EXTENSION));

    if (preg_match('(mkv|avi|flv|mov|m4v|mpg|wmv|mpeg|mp4|webm)', $EXTNSN) === 1) {
        shell_exec($MEDIAPLAYER . $MPLAYER_WH . "\"" . $FILE . "\" > /dev/null &");
    } else if (preg_match('(png|jpg|jpeg|gif)', $EXTNSN) === 1) {
        shell_exec($IMGVIEWER . ' "' . $FILE . '" > /dev/null &');
    } else if (preg_match('(psf|mp3|ogg|flac)', $EXTNSN) === 1) {
        shell_exec($MUSICPLAYER . '  "' . $FILE . '" > /dev/null &');
    } else if (preg_match('(txt)', $EXTNSN) === 1) {
        shell_exec($TEXTVIEWER . '  "' . $FILE . '" > /dev/null &');
    } else if (preg_match('(pdf)', $EXTNSN) === 1) {
        shell_exec($PDFVIEWER . ' "' . $FILE . '" > /dev/null &');
    // Has to be below b/c pdf somehow regesters as an office app.... wtf....
    } else if (preg_match('(odt|doc|docx|rtf)', $EXTNSN) === 1) {
        shell_exec($OFFICEPROG . '  "' . $FILE . '" > /dev/null &');
    }
}


chdir("../../");
if (isset($_POST["media"])) {
    openFile($_POST["media"]);
}

?>
