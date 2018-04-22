<?php
    // Start the session
    session_start();

    if (isset($_SESSION["refreshState"])) {
        $state =  $_SESSION["refreshState"];
    } else {
        $state = "none";
        $_SESSION["refreshState"] = $state;
    }

    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');
    echo "data:" . $state . "\n\n";

    $_SESSION["refreshState"] = "none";
    flush();
?>
