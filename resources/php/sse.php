<?php
    // Start the session
    session_start();
    include 'config.php';

    if (isset($_SESSION["refreshState"])) {
        $state =  $_SESSION["refreshState"];
    } else {
        $state = "none";
        $_SESSION["refreshState"] = $state;
    }

    if (isset($_SESSION["unlockTime"]) && $_SESSION["unlockTime"] >= 0) {
        $_SESSION["unlockTime"] -= 1;
    }

    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');
    echo "data:" . $state . "\n\n";

    $_SESSION["refreshState"] = "none";
    flush();
?>
