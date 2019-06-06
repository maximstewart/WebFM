<?php
include_once 'connection.php';
include_once 'serverMessenger.php';

function getTabLinks() {
    GLOBAL $db;

    $res           = $db->query('Select * FROM faves');
    $GeneratedJSON = array('FAVES_LIST' => array());
    while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
        $GeneratedJSON['FAVES_LIST'][] = $row['link'];
    }

    echo json_encode($GeneratedJSON);
}

function manageLink($ACTION, $PATH) {
    GLOBAL $db;
    $ACTION_TYPE = "";

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
    $stmt->close();

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
