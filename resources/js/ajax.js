var pathNodes = [];  // Path parts  Could store a cookie to keep sessions

function getDirSSE() {
    var path = "";

    // Create path from array of items
    for (pathNode of pathNodes) { path += pathNode; }
    path = "dirQuery=" + path;
    process(path);
}

function getDir(query) {
    var formULPTH    = document.getElementById("DIRPATHUL");
    var path         = "";

    // push or pop to path list
    if (query === "/") {
        // Process path from cookie and set to array/list
        if (document.cookie) {
            var temp = document.cookie.replace("dirQuery=", "");
            temp = temp.split("/");
            // Subtract one b/c paths end with / and create empty slot
            var size = temp.length - 1;

            for (var i = 0; i < size; i++) {
                pathNodes.push(temp[i] + "/");
            }
        // If no cookie, etup path from root
        } else {
            pathNodes.push("." + query);                   // If in root of server
        }
    } else if (query === "../") {
        if (pathNodes.length > 1) { pathNodes.pop(); }     // Only remove while not in root
    } else if (query === "./") {                           // Do nothing since re-scanning dir
    } else    { pathNodes.push(query); }                   // Add path

    // Create path from array of items
    for (pathNode of pathNodes) { path += pathNode; }

    formULPTH.value    = path;                             // Used when uploading a file
    path               = "dirQuery=" + path;
    process(path);
}

// Get dir info...
function process(path) {
    var xhttp = new XMLHttpRequest();                      // Create the xhttp object

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
    xhttp.open("POST", "resources/php/process.php", true); // Open the connection
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.overrideMimeType('application/xml');             // Force return to be XML
    xhttp.send(path);                                      // Start the process

    // Use a cookie for persistence during browser session....
    document.cookie = path + "; expires=Sun, 31 Dec 2034 12:00:00 UTC";
}
