<?php
    // Check if sub folder is in locked folder
    function checkForLock($NEWPATH, $PASSWD) {
        include 'config.php';

        $LOCKS = explode("::::", $LOCKEDFOLDERS);
        $size  = sizeof($LOCKS);

        if (isset($_SESSION["unlockTime"]) && $_SESSION["unlockTime"] > 0) {
            return false;
        }

        for ($i = 0; $i < $size; $i++) {
            if (strpos($NEWPATH, $LOCKS[$i]) !== false) {
                if ($PASSWD === $LOCKPASSWORD) {
                    $_SESSION["unlockTime"] = $UNLOCKTIME;
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

        if (isset($_SESSION["unlockTime"]) && $_SESSION["unlockTime"] > 0) {
            $_SESSION["unlockTime"] = -1;
            $message = "Server: [Success] --> Folders unlocked!";
            serverMessage("success", $message);
        } else {
            $message = "Server: [Warning] --> Folders aren't unlocked!"
                     . "\n" . $_SESSION["unlockTime"];
            serverMessage("warning", $message);
        }
    }


if (isset($_POST['lockFolders'])) {
    lockFolders();
}

?>
