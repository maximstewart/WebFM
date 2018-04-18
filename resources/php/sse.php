<?php
    // Prompt an update clint side when sse checks that there is updateListing.
    $myfile = fopen("../vars.txt", "r");
    $state =  fgets($myfile);
    fclose($myfile);

    $myfile = fopen("../vars.txt", "w");
    fclose($myfile);

    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');
    echo "data:" . $state . "\n\n";
    flush();
?>
