<?php
    // Start the session
    session_start();

    if ($_SESSION["state"] != null || $_SESSION["state"] == "undefined") {
        $state =  $_SESSION["state"];
    }

    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');
    echo "data:" . $state . "\n\n";

    $_SESSION["state"] = "none";
    flush();
?>
