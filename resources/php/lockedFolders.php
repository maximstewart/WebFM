<?php
    // Check if sub folder is in locked folder
    function checkForLock($NEWPATH, $PASSWD) {
        include 'config.php';

        $LOCKS = explode("::::", $LOCKEDFOLDERS);
        $size  = sizeof($LOCKS);

        if (isset($_SESSION["unlockState"]) && $_SESSION["unlockState"] == true) {
            return false;
        }

        for ($i = 0; $i < $size; $i++) {
            if (strpos($NEWPATH, $LOCKS[$i]) !== false) {
                if ($PASSWD === $LOCKPASSWORD) {
                    $_SESSION["unlockState"] = true;
                    return false;
                } else {
                    return true;
                }
            }
        }
    return false;
    }

    function lockFolders() {
        session_start();
        include 'serverMessenger.php';

        if (isset($_SESSION["unlockState"]) && $_SESSION["unlockState"] == true) {
            $_SESSION["unlockState"] = false;
            $message = "Server: [Success] --> Folders unlocked!";
            serverMessage("success", $message);
        } else {
            $message = "Server: [Warning] --> Folders aren't unlocked!"
                     . "\n" . $_SESSION["unlockState"];
            serverMessage("warning", $message);
        }
    }


if (isset($_POST['lockFolders'])) {
    lockFolders();
}

?>
