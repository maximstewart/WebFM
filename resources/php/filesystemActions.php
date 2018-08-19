<?php
session_start();

// Create file or folder
function createItem($FILE, $TYPE) {
    $FILE = preg_replace('/[^.[:alnum:]_-]/','_',trim($FILE));  // converting all on alphanumeric chars to _
    $FILE = preg_replace('/\.*$/','',$FILE);                    // removing dot . after file extension

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
    $GeneratedXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
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
                $GeneratedXML .= "<SERV_MSG class='warnning'>" .
                     "Server: [Warnning] --> This file already exists. Overwriting it.</SERV_MSG>";
            } else {
                $GeneratedXML .= "<SERV_MSG class='warnning'>" .
                     "Server: [Warnning] --> This file might be a directory. Or, no files were submitted for uploading.</SERV_MSG>";
                $uploadOk = 0;
            }
        }

        // Check file size
        $fileSize = $_FILES['filesToUpload']['size'][$i];
        if ($fileSize > 500000000000) {
            $GeneratedXML .= "<SERV_MSG class='warnning'>" .
                 "Server: [Warnning] --> This file is too large.</SERV_MSG>";
            $uploadOk = 0;
        }

        // Allow certain file formats
        // $ext = pathinfo($targetFile,PATHINFO_EXTENSION);
        // if(!preg_match('/^.*\.(rar|iso|img|tar|zip|7z|7zip|jpg|jpeg|png|gif|mpeg|mov|flv|avi|mp4|webm|mpg|mkv|m4a|mp3|ogg|docx|doc|odt|txt|pdf|)$/i', strtolower($ext))) {
        //     $GeneratedXML .= "<SERV_MSG class='warnning'>This file type is not allowed. File Not uploade.</SERV_MSG>";
        //     $uploadOk = 0;
        // }

        // if everything is ok, try to upload file
        if ($uploadOk !== 0) {
            if (move_uploaded_file($fileTmpName, $targetFile)) {
                $GeneratedXML .= "<SERV_MSG class='success'>" .
                     "Server: [Success] --> The file " . $fileName . " has been uploaded.</SERV_MSG>";
                $_SESSION["refreshState"] = "updateListing";
            }
        } else {
            $GeneratedXML .= "<SERV_MSG class='error'>" .
                 "Server: [Error] --> Your file " . $fileName . " was not uploaded.</SERV_MSG>";
        }
    }
    echo $GeneratedXML;
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
}


chdir("../../");
if (isset($_POST["createItem"],
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
    echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?><SERV_MSG class='error'>" .
         "Server: [Error] --> Incorrect access attempt!</SERV_MSG>";
}

?>
