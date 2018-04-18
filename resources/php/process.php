<?php
 // Retrieve data
function dirListing($PATH) {
    $GeneratedXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><DIR_LIST>"
                    . "<PATH_HEAD>" . $PATH . "</PATH_HEAD>";

    $dirContents = scandir($PATH);
    foreach ($dirContents as $fileName) {
        $fullPath = $PATH . $fileName;

        if (is_dir($PATH . $fileName)) {
           $GeneratedXML .= "<DIR>" . $fileName . "/</DIR>";
       } elseif (preg_match('/^.*\.(mkv|avi|flv|mov|m4v|mpg|wmv|mpeg|mp4|webm)$/i', strtolower($fileName))) {
           $NAMEHASH = hash('sha256', $fileName);
           if (!file_exists('resources/images/thumbnails/' . $NAMEHASH . '.jpg')) {
               shell_exec('resources/ffmpegthumbnailer -t 65% -s 320 -c jpg -i "'
                          . $fullPath . '" -o resources/images/thumbnails/'
                          . $NAMEHASH . '.jpg');
           }
           $GeneratedXML .=
           "<VID_FILE>"
             . "<VID_IMG>/resources/images/thumbnails/" . $NAMEHASH . ".jpg</VID_IMG>"
             . "<VID_NAME>" . $fileName . "</VID_NAME>" .
           "</VID_FILE>";
       } elseif (preg_match('/^.*\.(png|jpg|gif|jpeg)$/i', strtolower($fileName))) {
            $GeneratedXML .=
            "<IMG_FILE>"
              . "<IMAGE_NAME>" . $fileName . "</IMAGE_NAME>"
              . "</IMG_FILE>";
        } else {
           $GeneratedXML .=
           "<FILE>"
             . "<FILE_NAME>" . $fileName . "</FILE_NAME>"
             . "</FILE>";
       }
    }
    $GeneratedXML .= "</DIR_LIST>";
    echo $GeneratedXML;
}

// Determin action
chdir("../../");
if (isset($_POST['dirQuery'])) {
    dirListing(trim($_POST['dirQuery']));
} else {
    echo "<h2 class='error'>Error! Illegal Access Method!</h2>";
}

?>
