// SSE events if supported
if(typeof(EventSource) !== "undefined") {
    let source = new EventSource("resources/php/sse.php");
    source.onmessage = (event) => {
        if (event.data === "updateListing") {
            getDir("./");
        }
    };
} else {
    console.log("SSE Not Supported In Browser...");
}

const getFavesList = () => {
    doAjax("resources/php/dbController.php", "getTabs=true");
}

const doAjax = async (actionPath, data) => {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            // Send the returned data to further process
            if (this.responseXML != null) {
                handleXMLReturnData(this.responseXML);
            } else {
                document.getElementById('dynDiv').innerHTML =
                "<p class=\"error\" style=\"width:100%;text-align:center;\"> "
                + "No content returned. Check the folder path.</p>";
            }
        }
    };

    xhttp.open("POST", actionPath, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.overrideMimeType('application/xml'); // Force return to be XML
    xhttp.send(data);
}

const fileUploader = (data) => {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            // Send the returned data to further process
            if (this.responseXML != null) {
                handleXMLReturnData(this.responseXML);
            }
        }
    };

    xhttp.open("POST", "resources/php/filesystemActions.php", true);
    xhttp.overrideMimeType('application/xml'); // Force return to be XML
    xhttp.send(data);
}
