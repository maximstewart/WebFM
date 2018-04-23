<?php
session_start();

// Create file or folder
function createItem($FILE, $TYPE) {
    if ($TYPE == "dir"){
        mkdir($FILE, 0755);
    } else if ($TYPE == "file") {
         $myfile = fopen($FILE, "w");
         fclose($myfile);
    }
    $_SESSION["refreshState"] = "updateListing";
}

// File or folder delition
function deleteItem($FILE) {
    if (is_dir($FILE)){
        //GLOB_MARK adds a slash to directories returned
        $files = glob($FILE . '*', GLOB_MARK);
        foreach ($files as $file) {
            deleteItem($file);
        }
        rmdir($FILE);
    } else if (is_file($FILE)) {
        unlink($FILE);
    }
    $_SESSION["refreshState"] = "updateListing";
}

// Rename file or folder
function renameItem($OLDFILE, $NEWNAME, $PATH) {
    rename($PATH . $OLDFILE, $PATH . $NEWNAME);
    $_SESSION["refreshState"] = "updateListing";
}

// Uploader
function uploadFiles($targetDir) {
    echo "<!DOCTYPE html>"
        . "<head>"
        . "<link type='text/css' rel='stylesheet' href='../css/base.css'/>"
        . "<link type='text/css' rel='stylesheet' href='../css/main.css'/>"
        . "</head><body>";

    $numberOfFiles = count($_FILES['filesToUpload']['name']);
    for ($i=0; $i < $numberOfFiles; $i++) {
        $uploadOk = 1;
        $fileName = $_FILES['filesToUpload']['name'][$i];
        $fileTmpName = $_FILES['filesToUpload']['tmp_name'][$i];

        // Check if file already exists
        $targetFile = $targetDir . $fileName;
        if (file_exists($targetFile)) {
            if (is_file($targetFile)) {
                unlink($targetFile);
                echo "<span class='warnning'>Server: [Warnning] --> This file already exists. Overwriting it.</span>";
            } else {
                echo "<span class='warnning'>Server: [Warnning] --> This file might be a directory. Or, no files were submitted for uploading.</span>";
                $uploadOk = 0;
            }
        }

        // Check file size
        $fileSize = $_FILES['filesToUpload']['size'][$i];
        if ($fileSize > 500000000000) {
            echo "<span class='warnning'>Server: [Warnning] --> This file is too large.</span>";
            $uploadOk = 0;
        }

        // Allow certain file formats
        // $ext = pathinfo($targetFile,PATHINFO_EXTENSION);
        // if($ext != "rar" && $ext != "iso" && $ext != "img" && $ext != "tar"
        // && $ext != "zip" && $ext != "7z" && $ext != "7zip" && $ext != "jpg"
        // && $ext != "png" && $ext != "jpeg" && $ext != "gif" && $ext != "mpeg"
        // && $ext != "MOV" && $ext != "flv" && $ext != "avi" && $ext != "mp4"
        // && $ext != "mov" && $ext != "mp3" && $ext != "m4a" && $ext != "ogg"
        // && $ext != "mkv" && $ext != "docx" && $ext != "doc" && $ext != "odt"
        // && $ext != "txt" && $ext != "pdf" && $ext != "webm" && $ext != "M4A"
        //                                                 && $ext != "mpg" ) {
        //     echo "<span class='warnning'>This file type is not allowed. File Not uploade.</span>";
        //     $uploadOk = 0;
        // }

        // if everything is ok, try to upload file
        if ($uploadOk !== 0) {
            if (move_uploaded_file($fileTmpName, $targetFile)) {
                echo "<span class='success'>Server: [Success] --> The file " . $fileName . " has been uploaded.</span>";
                $_SESSION["refreshState"] = "updateListing";
            }
        } else {
            echo "<span class='error'>Server: [Error] --> Your file " . $fileName . " was not uploaded.</span>";
        }
    }
    echo "</body></html>";
}

// Local program file access
function openFile($FILE) {
    include 'config.php';
    $EXTNSN = strtolower(pathinfo($FILE, PATHINFO_EXTENSION));

    if (preg_match('(mkv|avi|flv|mov|m4v|mpg|wmv|mpeg|mp4|webm)', $EXTNSN) === 1) {
        shell_exec($MEDIAPLAYER . $MPLAYER_WH . "\"" . $FILE . "\" > /dev/null &");
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
}


chdir("../../");
if (isset($_POST["createItem"]) && isset($_POST["item"]) && isset($_POST["type"])) {
    createItem($_POST["item"], $_POST["type"]);
} else if (isset($_POST["deleteItem"]) && isset($_POST["item"])) {
    deleteItem($_POST["item"]);
} else if (isset($_POST["renameItem"]) && isset($_POST["oldName"]) && isset($_POST["newName"]) && isset($_POST["path"])) {
    renameItem($_POST["oldName"], $_POST["newName"], $_POST["path"]);
} else if(isset($_POST["UploadFiles"]) && isset($_POST["DIRPATHUL"])) {
    uploadFiles($_POST["DIRPATHUL"]);
} else if (isset($_POST["media"])) {
    openFile($_POST["media"]);
} else {
    echo "<span style='color:rgb(255, 0, 0);'>Server: [Error] --> Incorrect access attempt!</span>";
}



?>
