<?php
include_once 'serverMessenger.php';

chdir("../../");
$db = new SQLite3('resources/db/webfm.db');
if($db === false){
    $message = "Server: [Error] --> Database connection failed!";
    serverMessage("error", $message);
}
?>
