<?php
function renameItem($OLDFILE, $NEWNAME, $PATH) {
    rename($PATH . $OLDFILE, $PATH . $NEWNAME);
}


chdir("../../");
if (isset($_POST["oldName"]) && isset($_POST["newName"]) && isset($_POST["path"])) {
    renameItem($_POST["oldName"], $_POST["newName"], $_POST["path"]);
}

?>
