<?php

function openFile($FILE) {
    include 'config.php';

    if (preg_match('(mkv|wmv|mp4|webm|avi|m4v|ogv|flv)', strtolower($FILE)) === 1) {
        shell_exec('cd ../../ && ' . $MEDIAPLAYER . ' "' . $FILE . '" &');
    } else if (preg_match('(png|jpg|jpeg|gif)', strtolower($FILE)) === 1) {
        shell_exec('cd ../../ && ' . $IMGVIEWER . ' "' . $FILE . '" &');
    } else if (preg_match('(psf|mp3|ogg|flac)', strtolower($FILE)) === 1) {
        shell_exec('cd ../../ &&   ' . $MUSICPLAYER . '  "' . $FILE . '" &');
    } else if (preg_match('(pdf)', strtolower($FILE)) === 1) {
        shell_exec('cd ../../ && ' . $PDFVIEWER . ' "' . $FILE . '" &');
    }

}


if (isset($_POST["media"])) {
    openFile($_POST["media"]);
}

?>
