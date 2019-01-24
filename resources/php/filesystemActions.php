<?php
session_start();
include_once 'serverMessenger.php';

// Create file or folder
function createItem($FILE, $TYPE) {
    $FILE = trim($FILE);
    $FILE = preg_replace('/\.*$/','',$FILE);  // removing dot . after file extension

    if ($TYPE === "dir"){
        mkdir($FILE, 0755);
    } else if ($TYPE === "file") {
         $myfile = fopen($FILE, "w");
         fclose($myfile);
    } else {
        $message = "Server: [Error] --> Failed to create folder or file!";
        serverMessage("error", $message);
        return;
    }

    $message = "Server: [Success] --> The file " . $FILE . " has been created.";
    serverMessage("success", $message);
    $_SESSION["refreshState"] = "updateListing";
}

// File or folder delition
function deleteItem($FILE) {
    if (filetype($FILE) == "dir"){
        //GLOB_MARK adds a slash to directories returned
        $files = glob($FILE . '*', GLOB_MARK);
        foreach ($files as $file) {
            deleteItem($file);
        }
        rmdir($FILE);
    } else if (filetype($FILE) == "file") {
        unlink($FILE);
    } else {
        $message = "Server: [Error] --> Failed to delete item! Not a folder or file!";
        serverMessage("error", $message);
        return;
    }

    $message = "Server: [Success] --> The file(s) has/have been deleted.";
    serverMessage("success", $message);
    $_SESSION["refreshState"] = "updateListing";
}

// Rename file or folder
function renameItem($OLDFILE, $NEWNAME, $PATH) {
    rename($PATH . $OLDFILE, $PATH . $NEWNAME);
    $message = "Server: [Success] --> The file " . $OLDFILE . " has been renamed to " . $NEWNAME . " side.";
    serverMessage("success", $message);
    $_SESSION["refreshState"] = "updateListing";
}

// Uploader
function uploadFiles($targetDir) {
    $numberOfFiles = count($_FILES['filesToUpload']['name']);

    if ($numberOfFiles === 0) {
        $message = "Server: [Error] --> No files were uploaded!";
        serverMessage("error", $message);
        return;
    }

    $type = "";
    $message = "";
    for ($i=0; $i < $numberOfFiles; $i++) {
        $uploadOk = 1;
        $fileName = $_FILES['filesToUpload']['name'][$i];
        $fileTmpName = $_FILES['filesToUpload']['tmp_name'][$i];

        // Check if file already exists
        $targetFile = $targetDir . $fileName;
        if (file_exists($targetFile)) {
            if (filetype($targetFile) == "file") {
                unlink($targetFile);
                $message = "Server: [Warnning] --> This file already exists. Overwriting it.";
            } else {
                $message = "Server: [Warnning] --> This file might be a directory. Or, no files were submitted for uploading.";
                $uploadOk = 0;
            }
        }

        // Check file size
        $fileSize = $_FILES['filesToUpload']['size'][$i];
        if ($fileSize > 500000000000) {
            $message = "Server: [Warnning] --> This file is too large.";
            $uploadOk = 0;
        }

        // Allow certain file formats
        // $ext = pathinfo($targetFile,PATHINFO_EXTENSION);
        // if(!preg_match('/^.*\.(rar|iso|img|tar|zip|7z|7zip|jpg|jpeg|png|gif|mpeg|mov|flv|avi|mp4|webm|mpg|mkv|m4a|mp3|ogg|docx|doc|odt|txt|pdf|)$/i', strtolower($ext))) {
        // $message = "Server: [Warnning] --> This file type is not allowed.";
        //     $uploadOk = 0;
        // }

        // if everything is ok, try to upload file
        if ($uploadOk !== 0) {
            if (move_uploaded_file($fileTmpName, $targetFile)) {
                $type    = "success";
                $message = "Server: [Success] --> The file " . $fileName . " has been uploaded.";
                $_SESSION["refreshState"] = "updateListing";
            }
        } else {
            $type     = "error";
            $message .= "\nServer: [Error] --> Your file " . $fileName . " was not uploaded.";
        }
    }

    serverMessage($type, $message);
}

// Local program file access
function openFile($FILE) {
    include 'config.php';
    $EXTNSN = strtolower(pathinfo($FILE, PATHINFO_EXTENSION));

    if (preg_match('(mkv|avi|flv|mov|m4v|mpg|wmv|mpeg|mp4|webm)', $EXTNSN) === 1) {
        shell_exec($MEDIAPLAYER . "\"" . $FILE . "\" > /dev/null &");
    } else if (preg_match('(png|jpg|jpeg|gif)', $EXTNSN) === 1) {
        shell_exec($IMGVIEWER . ' "' . $FILE . '" > /dev/null &');
    } else if (preg_match('(psf|mp3|ogg|flac)', $EXTNSN) === 1) {
        shell_exec($MUSICPLAYER . '  "' . $FILE . '" > /dev/null &');
    } else if (preg_match('(odt|doc|docx|rtf)', $EXTNSN) === 1) {
        shell_exec($OFFICEPROG . '  "' . $FILE . '" > /dev/null &');
    } else if (preg_match('(txt)', $EXTNSN) === 1) {
        shell_exec($TEXTVIEWER . '  "' . $FILE . '" > /dev/null &');
    } else if (preg_match('(pdf)', $EXTNSN) === 1) {
        shell_exec($PDFVIEWER . ' "' . $FILE . '" > /dev/null &');
    }

    $message = "Server: [Success] --> The file " . $FILE . " has been opened server side.";
    serverMessage("success", $message);
}

function remuxVideo($FILE) {
    $FILE        = trim($FILE);
    $PTH         = "resources/tmp/";
    $HASHED_NAME = hash('sha256', $FILE) . '.mp4';
    $EXTNSN      = strtolower(pathinfo($FILE, PATHINFO_EXTENSION));

    if (!file_exists($PTH . $HASHED_NAME)) {
        if (preg_match('(mp4)', $EXTNSN) === 1) {
            $COMMAND = 'ffmpeg -i "' . $FILE . '" -movflags +faststart -codec copy ' . $PTH . $HASHED_NAME;
            shell_exec($COMMAND . " > /dev/null &");
        }
    }

    $GeneratedXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
    $GeneratedXML .= "<REMUX_PATH>" . $PTH . $HASHED_NAME ."</REMUX_PATH>";
    echo $GeneratedXML;
}


chdir("../../");
if (isset($_POST["remuxVideo"], $_POST["mediaPth"])) {
    remuxVideo($_POST["mediaPth"]);
} else if (isset($_POST["createItem"],
          $_POST["item"],
          $_POST["type"])) {
    createItem($_POST["item"], $_POST["type"]);
} else if (isset($_POST["deleteItem"], $_POST["item"])) {
    deleteItem($_POST["item"]);
} else if (isset($_POST["renameItem"],
                 $_POST["oldName"],
                 $_POST["newName"],
                 $_POST["path"])) {
    renameItem($_POST["oldName"], $_POST["newName"], $_POST["path"]);
} else if(isset($_POST["UploadFiles"], $_POST["DIRPATHUL"])) {
    uploadFiles($_POST["DIRPATHUL"]);
} else if (isset($_POST["media"])) {
    openFile($_POST["media"]);
} else {
    $message = "Server: [Error] --> Incorrect access attempt!";
    serverMessage("error", $message);
}

?>
