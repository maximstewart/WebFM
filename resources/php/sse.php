<?php
    // Start the session
    session_start();
    include_once 'config.php';

    if (!isset($_SESSION["refreshState"])) {
        $_SESSION["refreshState"] = "none";
    }

    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');
    echo "data:" . $_SESSION["refreshState"] . "\n\n";

    $_SESSION["refreshState"] = "none";
    flush();
?>
