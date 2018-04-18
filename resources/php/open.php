<?php

function openFile($FILE) {
    include 'config.php';
    $EXTNSN = strtolower(pathinfo($FILE, PATHINFO_EXTENSION));

    if (preg_match('(mkv|avi|flv|mov|m4v|mpg|wmv|mpeg)', $EXTNSN) === 1) {
        shell_exec($MEDIAPLAYER . " \"" . $FILE . "\" &");
    } else if (preg_match('(png|jpg|jpeg|gif)', $EXTNSN) === 1) {
        shell_exec($IMGVIEWER . ' "' . $FILE . '" &');
    } else if (preg_match('(psf|mp3|ogg|flac)', $EXTNSN) === 1) {
        shell_exec($MUSICPLAYER . '  "' . $FILE . '" &');
    } else if (preg_match('(txt)', $EXTNSN) === 1) {
        shell_exec($TEXTVIEWER . '  "' . $FILE . '" &');
    } else if (preg_match('(pdf)', $EXTNSN) === 1) {
        shell_exec($PDFVIEWER . ' "' . $FILE . '" &');
    // Has to be below b/c pdf somehow regesters and an office app.... wtf....
} else if (preg_match('(odt|doc|docx|rtf)', $EXTNSN) === 1) {
        shell_exec($OFFICEPROG . '  "' . $FILE . '" &');
    }
}


chdir("../../");
if (isset($_POST["media"])) {
    openFile($_POST["media"]);
}

?>
