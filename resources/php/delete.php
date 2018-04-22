<?php
session_start();

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

chdir("../../");
if (isset($_POST["item"])) {
    deleteItem($_POST["item"]);
}

?>
