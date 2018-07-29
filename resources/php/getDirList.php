<?php

session_start();

// Start of retrieving dir data
function startListing($NEWPATH, $MERGESEASSONS, $PASSWD) {
    if (is_dir($NEWPATH)) {
        include 'lockedFolders.php';
        if (checkForLock($NEWPATH, $PASSWD) == false) {
            $GeneratedXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><DIR_LIST>"
            . "<PATH_HEAD>" . $NEWPATH . "</PATH_HEAD>";
            $subPath = ""; // This is used for season scanning as a means of properly getting
            // the video src.... It's left blank when not in a sub dir
            listDir($GeneratedXML, $NEWPATH, $MERGESEASSONS, $subPath);

            $GeneratedXML .= "</DIR_LIST>";
            echo $GeneratedXML;
        } else {
            $GeneratedXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
                          . "<MESSAGE>Folder is locked."
                          . "</MESSAGE>";
            echo $GeneratedXML;
        }
    }
}

// Used for recursion
function listDir(&$GeneratedXML, &$NEWPATH, &$MERGESEASSONS, &$subPath) {
    $dirContents = scandir($NEWPATH);
    foreach ($dirContents as $fileName) {
        // Filter for . and .. items We have controls for these actions
        if ($fileName !== "." && $fileName !== "..") {
            $fullPath = $NEWPATH . $fileName;
            if ($MERGESEASSONS == "trueHere" && is_dir($fullPath) &&
            strpos(strtolower($fileName), 'season') !== false) {
                $fileName .= "/";
                listDir($GeneratedXML, $fullPath, $MERGESEASSONS, $fileName);
            } else {
                processItem($GeneratedXML, $fullPath, $fileName, $subPath);
            }
        }
    }
}

// Assign XML Markup based on file type
function processItem(&$GeneratedXML, &$fullPath, &$fileName, $subPath) {
    if (is_dir($fullPath)) {
       $GeneratedXML .= "<DIR>" . $fileName . "/</DIR>";
   } elseif (preg_match('/^.*\.(mkv|avi|flv|mov|m4v|mpg|wmv|mpeg|mp4|webm)$/i', strtolower($fileName))) {
       $NAMEHASH = hash('sha256', $fileName);
       if (!file_exists('resources/images/thumbnails/' . $NAMEHASH . '.jpg')) {
           shell_exec('resources/ffmpegthumbnailer -t 65% -s 320 -c jpg -i "'
                      . $subPath . $fullPath . '" -o resources/images/thumbnails/'
                      . $NAMEHASH . '.jpg');
       }
       $GeneratedXML .=
       "<VID_FILE>"
         . "<VID_IMG>/resources/images/thumbnails/" . $NAMEHASH . ".jpg</VID_IMG>"
         . "<VID_NAME>" . $subPath . $fileName . "</VID_NAME>" .
       "</VID_FILE>";
   } elseif (preg_match('/^.*\.(png|jpg|gif|jpeg)$/i', strtolower($fileName))) {
        $GeneratedXML .=
        "<IMG_FILE>"
          . "<IMAGE_NAME>" . $subPath . $fileName . "</IMAGE_NAME>"
          . "</IMG_FILE>";
    } else {
       $GeneratedXML .=
       "<FILE>"
         . "<FILE_NAME>" . $subPath . $fileName . "</FILE_NAME>"
         . "</FILE>";
   }
}


// Determin action
chdir("../../");
if (isset($_POST['dirQuery'])) {
    startListing(trim($_POST['dirQuery']), $_POST['mergeType'], $_POST['passwd']);
} else {
    echo "<h2 class='error'>Error! Illegal Access Method!</h2>";
}

?>
