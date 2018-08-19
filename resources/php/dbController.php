<?php
session_start();

function getTabLinks() {
    $db = new SQLite3('resources/db/webfm.db');

    if($db === false){
        die("ERROR: Could not connect to db.");
    }

    $res = $db->query('Select * FROM faves');
    $GeneratedXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><TABS_LIST>";
    while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
        $GeneratedXML .= "<TAB_ID>" . $row['id'] . "</TAB_ID>" .
                         "<TAB_LINK>" . $row['link'] . "</TAB_LINK>";
    }
    $GeneratedXML .= "</TABS_LIST>";
    echo $GeneratedXML;
}

function addLink($PATHID, $PATH) {
    $db = new SQLite3('resources/db/webfm.db');

    if($db === false){
        die("ERROR: Could not connect to db.");
    }

    $stmt = $db->prepare('INSERT INTO faves VALUES(:id,:link)');
    $stmt->bindValue(":id", $PATHID, SQLITE3_TEXT);
    $stmt->bindValue(":link", $PATH, SQLITE3_TEXT);

    $stmt->execute();
}

function deleteLink($PATHID) {
    $db = new SQLite3('resources/db/webfm.db');

    if($db === false){
        die("ERROR: Could not connect to db.");
    }

    $stmt = $db->prepare('DELETE FROM faves WHERE id = :id');
    $stmt->bindValue(":id", $PATHID, SQLITE3_TEXT);
    $stmt->execute();
}


// Determin action
chdir("../../");
if (isset($_POST['getTabs'])) {
    getTabLinks();
} elseif (isset($_POST['addLink'],
          $_POST['pathID'],
          $_POST['linkPath'])) {
    addLink($_POST['pathID'], $_POST['linkPath']);
} elseif (isset($_POST['deleteLink'],
                $_POST['pathID'])) {
    deleteLink($_POST['pathID']);
} else {
    echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?><SERV_MSG class='error'>" .
         "Server: [Error] --> Illegal Access Method!</SERV_MSG>";
}

?>
