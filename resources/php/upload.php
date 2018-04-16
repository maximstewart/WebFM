<?php
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
        $targetFile = "../../" . $targetDir . $fileName;
        if (file_exists($targetFile)) {
            unlink($targetFile);
            echo "<span class='warnning'>Server: [Warnning] --> This file already exists. Overwriting it.</span>";
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

        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 0) {
            echo "<span class='error'>Server: [Error] --> Your file " . $fileName . " was not uploaded.</span>";
        // if everything is ok, try to upload file
        } else {
            if (move_uploaded_file($fileTmpName, $targetFile)) {
                echo "<span class='success'>Server: [Success] --> The file " . $fileName . " has been uploaded.</span>";
            } else {
                echo "<span class='error'>Server: [Error] --> File not uploaded for the above reason(s).</span>";
            }
        }
    }
    echo "</body></html>";

    // Prompt an update clint side when sse checks that there is updateListing.
    $myfile = fopen("../vars.txt", "wa+");
    $txt = "updateListing";
    fwrite($myfile, $txt);
    fclose($myfile);
}

// Check access type.
if(isset($_POST["UploadFiles"])) {
    uploadFiles($_POST["DIRPATHUL"]);
} else {
    echo "<span style='color:rgb(255, 0, 0);'>Server: [Error] --> Incorrect access attempt!</span>";
}

?>
