<?php
include_once 'serverMessanger.php';

function getTabLinks() {
    $db = new SQLite3('resources/db/webfm.db');

    if($db === false){
        $message = "Server: [Error] --> Database connection failed!";
        serverMessage("error", $message);
        die("ERROR: Could not connect to db.");
    }

    $res = $db->query('Select * FROM faves');
    $GeneratedXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><FAVES_LIST>";
    while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
        $GeneratedXML .= "<FAVE_LINK>" . $row['link'] . "</FAVE_LINK>";
    }
    $GeneratedXML .= "</FAVES_LIST>";
    echo $GeneratedXML;
}

function manageLink($ACTION, $PATH) {
    $db = new SQLite3('resources/db/webfm.db');
    $ACTION_TYPE = "";

    if($db === false){
        $message = "Server: [Error] --> Database connection failed!";
        serverMessage("error", $message);
        die("ERROR: Could not connect to db.");
    }

    // If action isn't true then we add else we delete or exit.
    if ($ACTION == "false") {
        $stmt = $db->prepare('INSERT INTO faves VALUES(:link)');
        $ACTION_TYPE = "added to";
    } elseif ($ACTION == "true") {
        $stmt = $db->prepare('DELETE FROM faves WHERE link = :link');
        $ACTION_TYPE = "deleted from";
    } else {
        $message = "Server: [Error] --> Action for adding or deleting isn't set properly!";
        serverMessage("error", $message);
        return;
    }

    $stmt->bindValue(":link", $PATH, SQLITE3_TEXT);
    $stmt->execute();

    $message = "Server: [Success] --> Fave link: " .
                $PATH . "    " . $ACTION_TYPE . " the database!";
    serverMessage("success", $message);
}


// Determin action
chdir("../../");
if (isset($_POST['getTabs'])) {
    getTabLinks();
} elseif (isset($_POST['deleteLink'],
                $_POST['linkPath'])) {
    manageLink($_POST['deleteLink'], $_POST['linkPath']);
} else {
    $message = "Server: [Error] --> Illegal Access Method!";
    serverMessage("error", $message);
}

?>
