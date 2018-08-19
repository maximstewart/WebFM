<?php
function serverMessage($TYPE, $MESSAGE) {
    $GeneratedXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
    $GeneratedXML .= "<SERV_MSG class='" . $TYPE . "'>" . $MESSAGE ."</SERV_MSG>";
    echo $GeneratedXML;
}
?>
