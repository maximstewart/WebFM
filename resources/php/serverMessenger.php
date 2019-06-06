<?php
function serverMessage($TYPE, $MESSAGE) {
    $GeneratedJSON = array( 'message' =>
                            array(
                                'type' => $TYPE,
                                'text' => $MESSAGE
                            )
                     );

    echo json_encode($GeneratedJSON);
}
?>
