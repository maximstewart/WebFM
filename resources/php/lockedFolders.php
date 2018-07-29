<?php
    // Check if sub folder is in locked folder
    function checkForLock($NEWPATH, $PASSWD) {
        include 'config.php';

        $LOCKS = explode("::::", $LOCKEDFOLDERS);
        $size  = sizeof($LOCKS);

        if ($_SESSION["unlockTime"] > 0) {
            return false;
        }

        for ($i = 0; $i < $size; $i++) {
            if (strpos($NEWPATH, $LOCKS[$i]) !== false) {
                if ($PASSWD == $LOCKPASSWORD) {
                    $_SESSION["unlockTime"] = 60;
                    return false;
                } else {
                    return true;
                }
            }
        }
    return false;
    }
?>
