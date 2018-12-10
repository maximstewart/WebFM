<?php
session_start();
include_once 'serverMessanger.php';

// Start of retrieving dir data
function startListing($NEWPATH, $MERGESEASSONS, $PASSWD) {
    if (filetype($NEWPATH) == "dir") {
        include_once 'lockedFolders.php';

        if (checkForLock($NEWPATH, $PASSWD) == false) {
            $GeneratedXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><DIR_LIST>"
                          . "<PATH_HEAD>" . $NEWPATH . "</PATH_HEAD>";
            $subPath = ""; // This is used for season scanning as a means of properly getting
                           // the video src.... It's left blank when not in a sub dir

            listDir($GeneratedXML, $NEWPATH, $MERGESEASSONS, $subPath);

            $GeneratedXML .= "<IN_FAVE>" . isInDBCheck($NEWPATH) . "</IN_FAVE>";
            $GeneratedXML .= "</DIR_LIST>";
            echo $GeneratedXML;
        } else {
            $GeneratedXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
                          . "<LOCK_MESSAGE>Folder is locked."
                          . "</LOCK_MESSAGE>";
            echo $GeneratedXML;
        }
    }
}

function listDir(&$GeneratedXML, &$NEWPATH, &$MERGESEASSONS, &$subPath) {
    $handle = opendir($NEWPATH);

    // Note: We'll be filtering out . and .. items We have controls for these actions
    if ($MERGESEASSONS !== "trueHere") {
        while (false !== ($fileName = readdir($handle))) {
            if ($fileName !== "." && $fileName !== "..") {
                $fullPath = $NEWPATH . $fileName;
                processItem($GeneratedXML, $fullPath, $fileName, $subPath);
            }
        }
    } else {
        while (false !== ($fileName = readdir($handle))) {
            if ($fileName !== "." && $fileName !== "..") {
                $fullPath = $NEWPATH . $fileName;
                if (filetype($fullPath) == "dir" && strpos(strtolower($fileName),
                                                           'season') !== false) {
                    $fileName .= "/";
                    listDir($GeneratedXML, $fullPath, $MERGESEASSONS, $fileName);
                } else {
                    processItem($GeneratedXML, $fullPath, $fileName, $subPath);
                }
            }
        }
    }
    closedir($handle);
}

// Assign XML Markup based on file type
function processItem(&$GeneratedXML, &$fullPath, &$fileName, $subPath) {
    if (filetype($fullPath) == "dir") {
       $GeneratedXML  .= "<DIR>" . $fileName . "/</DIR>";
   } elseif (preg_match('/^.*\.(mkv|avi|flv|mov|m4v|mpg|wmv|mpeg|mp4|webm)$/i', strtolower($fileName))) {
       $NAMEHASH = hash('sha256', $fileName);
       if (!file_exists('resources/images/thumbnails/' . $NAMEHASH . '.jpg')) {
           shell_exec('resources/ffmpegthumbnailer -t 65% -s 320 -c jpg -i "'
                      . $subPath . $fullPath . '" -o resources/images/thumbnails/'
                      . $NAMEHASH . '.jpg');
       }
       $GeneratedXML .=
           "<VID_FILE>"
             . "<VID_NAME>" . $subPath . $fileName . "</VID_NAME>"
             . "<VID_IMG>/resources/images/thumbnails/" . $NAMEHASH . ".jpg</VID_IMG>" .
           "</VID_FILE>";
   } elseif (preg_match('/^.*\.(png|jpg|gif|jpeg)$/i', strtolower($fileName))) {
        $GeneratedXML .= "<IMG_FILE>" . $subPath . $fileName . "</IMG_FILE>";
    } else {
       $GeneratedXML  .= "<FILE>" . $subPath . $fileName . "</FILE>";
   }
}

function isInDBCheck($PATH) {
    $db = new SQLite3('resources/db/webfm.db');

    if($db === false){
        $message = "Server: [Error] --> Database connection failed!";
        serverMessage("error", $message);
        die("ERROR: Could not connect to db.");
    }

    $stmt = $db->prepare('SELECT 1 FROM faves WHERE link = :link');
    $stmt->bindValue(":link", $PATH, SQLITE3_TEXT);
    $result = $stmt->execute() ;
    $row = $result->fetchArray() ;

    if ($row > 0) {
        return "true";
    } else {
        return "false";
    }
}


// Determin action
chdir("../../");
if (isset($_POST['dirQuery'])) {
    startListing(trim($_POST['dirQuery']), $_POST['mergeType'], $_POST['passwd']);
} else {
    $message = "Server: [Error] --> Illegal Access Method!";
    serverMessage("error", $message);
}

?>
