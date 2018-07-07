var pathNodes = [];

// SSE events if supported
if(typeof(EventSource) !== "undefined") {
    var source = new EventSource("resources/php/sse.php");
    source.onmessage = function(event) {
        if (event.data === "updateListing") {
            getDir("./");
        }
    };
} else {
    console.log("SSE Not Supported In Browser...");
}

function getDir(query) {
    var formUlPth  = document.getElementById("DIRPATHUL");
    var path       = "";
    var cookies    = "";
    var dirCookie  = "";

    // push or pop to path list
    if (query === "/") {
        // Process path from cookie and set to array/list
        dirCookie = getCookie("dirQuery");
        if (dirCookie != "" && dirCookie != "./") {
            dirCookie = dirCookie.split("/");
            dirCookie.pop(); // account for ending empty slot

            var size = dirCookie.length;
            for (var i = 0; i < size; i++) {
                pathNodes.push(dirCookie[i] + "/");
            }
        } else {
            pathNodes = [];
            pathNodes.push("." + query);
        }
    } else if (query === "../") {
        // Only remove while not in root
        if (pathNodes.length > 1) {
            pathNodes.pop();
        }
    } else if (query === "./") {
        // Do nothing since re-scanning dir
    } else    {
        pathNodes.push(query); // Add path
    }

    // Create path from array of items
    for (pathNode of pathNodes) {
        path += pathNode;
    }

    formUlPth.value = path; // Setup upload path for form
    path            = "dirQuery=" + encodeURIComponent(path);
    process(path);
}

// Get dir info...
function process(path) {
    var mergeType = document.getElementById("MergeType");
    var xhttp     = new XMLHttpRequest();                      // Create the xhttp object

    // This is actually run after open and send are done
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            // Send the returned data to further process
            if (this.responseXML != null) {
                updateHTMLDirList(this.responseXML);
            } else {
                document.getElementById('dynDiv').innerHTML =
                "<p class=\"error\" style=\"width:100%;text-align:center;\"> "
                + "No content returned. Check the folder path.</p>";
            }
        }
    };
    xhttp.open("POST", "resources/php/getDirList.php", true);        // Open the connection
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.overrideMimeType('application/xml');                       // Force return to be XML
    xhttp.send(path + "&mergeType=" + mergeType.checked + "Here");   // Start the process

    // Use a cookie for persistence during browser session....
    document.cookie = path + "; expires=Sun, 31 Dec 2034 12:00:00 UTC";
}
