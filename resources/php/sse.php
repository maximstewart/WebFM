<?php
    // Prompt an update clint side when sse checks that there is updateListing.
    $myfile = fopen("../vars.txt", "wa+");
    $state =  fgets($myfile);

    if ($state == "updateListing") {
        $txt = "Null";
        fwrite($myfile, $txt);
    }

    fclose($myfile);

    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');
    echo "data:" . $state . "\n\n";
    flush();
?>
