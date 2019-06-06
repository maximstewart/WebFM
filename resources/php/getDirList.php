<?php
session_start();
include_once 'serverMessenger.php';

// Start of retrieving dir data
function startListing($NEWPATH, $MERGESEASSONS, $PASSWD) {
    if (filetype($NEWPATH) == "dir") {
        include_once 'lockedFolders.php';

        if (checkForLock($NEWPATH, $PASSWD) == false) {
            $subPath = ""; // This is used for season scanning as a means of properly getting
                           // the video src.... It's left blank when not in a sub dir

            $GeneratedJSON = array('PATH_HEAD' => $NEWPATH,
                                   'IN_FAVE' => isInDBCheck($NEWPATH),
                                   'list' => array()
                             );

            listDir($GeneratedJSON, $NEWPATH, $MERGESEASSONS, $subPath);
            echo json_encode($GeneratedJSON);
        } else {
            $message = "Server: [Error] --> Folder is locked.";
            serverMessage("locked", $message);
        }
    }
}

function listDir(&$GeneratedJSON, &$NEWPATH, &$MERGESEASSONS, &$subPath) {
    if ($MERGESEASSONS !== "true") {
        $files = array_diff(scandir($NEWPATH), array('..', '.', 'resources'));
        foreach ($files as $fileName) {
            $fullPath = $NEWPATH . '/' . $fileName;
            // error_log($fullPath, 4);
            processItem($GeneratedJSON, $fullPath, $fileName, $subPath);
        }
    } else {
        $files = array_diff(scandir($NEWPATH), array('..', '.', 'resources'));
        foreach ($files as $fileName) {
            $fullPath = $NEWPATH . $fileName;
            // error_log($fullPath, 4);
            if (filetype($fullPath) == "dir" && strpos(strtolower($fileName),
                                                       'season') !== false) {
                $fileName .= "/";
                listDir($GeneratedJSON, $fullPath, $MERGESEASSONS, $fileName);
            } else {
                processItem($GeneratedJSON, $fullPath, $fileName, $subPath);
            }
        }
    }
}

// Assign JSON Markup based on file type
function processItem(&$GeneratedJSON, &$fullPath, &$fileName, $subPath) {
    if (preg_match('/^.*\.(mkv|avi|flv|mov|m4v|mpg|wmv|mpeg|mp4|webm)$/i', strtolower($fileName))) {
        $NAMEHASH = hash('sha256', $fileName);
        if (!file_exists('resources/images/thumbnails/' . $NAMEHASH . '.jpg')) {
            shell_exec('resources/ffmpegthumbnailer -t 65% -s 320 -c jpg '
                       . '-i "' . $subPath . $fullPath . '" '
                       . '-o resources/images/thumbnails/' . $NAMEHASH . '.jpg'
            );
        }

        $GeneratedJSON['list']['vids'][] = array('video' =>
                                                  array('title' => $subPath . $fileName,
                                                        'thumbnail' => $NAMEHASH . '.jpg'
                                                  )
                                           );
    } elseif (preg_match('/^.*\.(png|jpg|gif|jpeg)$/i', strtolower($fileName))) {
        $GeneratedJSON['list']['imgs'][] = array('image' =>  $subPath . $fileName);
    } elseif (filetype($fullPath) == "dir") {
        $GeneratedJSON['list']['dirs'][] = array('dir' =>  $fileName . "/");
    } else {
        $GeneratedJSON['list']['files'][] = array('file' =>  $subPath . $fileName);
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
