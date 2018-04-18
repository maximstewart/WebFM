<?php

function createItem($FILE, $TYPE) {
    if ($TYPE == "dir"){
        mkdir($FILE, 0755);
    } else if ($TYPE == "file") {
         $myfile = fopen($FILE, "w");
         fclose($myfile);
    }
}

chdir("../../");
if (isset($_POST["item"])) {
    if (isset($_POST["isDir"])) {
        createItem($_POST["item"], $_POST["isDir"]);
    } else if (isset($_POST["isFile"])) {
        createItem($_POST["item"], $_POST["isFile"]);
    }
}

?>
