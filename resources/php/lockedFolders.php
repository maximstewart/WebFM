<?php
    // Check if sub folder is in locked folder
    function checkForLock($NEWPATH, $PASSWD) {
        include 'config.php';

        $LOCKS = explode("::::", $LOCKEDFOLDERS);
        $size  = sizeof($LOCKS);

        for ($i = 0; $i < $size; $i++) {
            if (strpos($NEWPATH, $LOCKS[$i]) !== false) {
                if ($PASSWD == $LOCKPASSWORD) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    return false;
    }
?>
