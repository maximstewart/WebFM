<?php
 // Retrieve data
function dirListing($PATH) {
    $CLEANPATH = $PATH;
    $PATH = "../../" . $PATH;
    $GeneratedXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><DIR_LIST>"
                    . "<PATH_HEAD>" . $CLEANPATH . "</PATH_HEAD>";

    $dirContents = scandir($PATH);
    foreach ($dirContents as $fileName) {
        $fullPath = $CLEANPATH . $fileName;

        if (is_dir($PATH . $fileName)) {
           $GeneratedXML .= "<DIR>" . $fileName . "/</DIR>";
       } elseif (preg_match('/^.*\.(mkv|avi|flv|mov|m4v|mpg|wmv|mpeg|mp4|webm)$/i', strtolower($fileName))) {
           $NAMEHASH = hash('sha256', $fileName);
           if (!file_exists('../images/thumbnails/' . $NAMEHASH . '.jpg')) {
               shell_exec('../ffmpegthumbnailer -t 65% -s 320 -c jpg -i "'
                          . $PATH . $fileName . '" -o ../images/thumbnails/'
                          . $NAMEHASH . '.jpg');
           }
           $GeneratedXML .=
           "<VID_FILE>"
             . "<VID_IMG>/resources/images/thumbnails/" . $NAMEHASH . ".jpg</VID_IMG>"
             . "<VID_PTH>" . $fullPath . "</VID_PTH>"
             . "<VID_NAME>" . $fileName . "</VID_NAME>" .
           "</VID_FILE>";
       } elseif (preg_match('/^.*\.(png|jpg|gif|jpeg)$/i', strtolower($fileName))) {
            $GeneratedXML .=
            "<IMG_FILE>"
              . "<IMAGE_LINK>". $fullPath . "</IMAGE_LINK>"
              . "<IMAGE_NAME>" . $fileName . "</IMAGE_NAME>"
              . "</IMG_FILE>";
        } else {
           $GeneratedXML .=
           "<FILE>"
             . "<FILE_PATH>" . $fullPath .  "</FILE_PATH>"
             . "<FILE_NAME>" . $fileName . "</FILE_NAME>"
             . "</FILE>";
       }
    }
    $GeneratedXML .= "</DIR_LIST>";
    echo $GeneratedXML;
}

// Determin action
if (isset($_POST['dirQuery'])) {
    dirListing(trim($_POST['dirQuery']));
} else {
    echo "<h2 class='errorStyling'>Error! Illegal Access Method!</h2>";
}

?>
