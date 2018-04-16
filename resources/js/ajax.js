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
        if (document.cookie) {
            var temp = document.cookie.replace("dirQuery=", "");
            temp = temp.split("/");
            // Subtract one b/c paths end with / and create empty slot
            var size = temp.length - 1;

            for (var i = 0; i < size; i++) {
                pathNodes.push(temp[i] + "/");
            }
        } else {
            pathNodes.push("." + query);                   // If in root of server
        }
    } else if (query === "../") {
        if (pathNodes.length > 1) { pathNodes.pop(); }     // Only remove while not in root
    } else if (query === "./") {                           // Do nothing since re-scanning dir
    } else    { pathNodes.push(query); }                   // Add path

    // Create path from array of items
    for (pathNode of pathNodes) { path += pathNode; }

    formULPTH.value    = path;                             // Used when upoading a file
    path               = "dirQuery=" + path;
    process(path);
}

function process(path) {
    // Get dir info...
    var xhttp = new XMLHttpRequest();                      // Create the xhttp object

    // This is actually run after open and send are done
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            // Send the returned data to further process
            updatePage(this.responseXML);
        }
    };
    xhttp.open("POST", "resources/php/process.php", true); // Open the connection
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.overrideMimeType('application/xml');             // Force return to be XML
    xhttp.send(path);                                      // Start the process

    // Use a cookie for persistence during browser session....
    document.cookie = path  +"; path=" + document.URL;
}

function updatePage(returnData) {
    var dirPath    = returnData.getElementsByTagName('PATH_HEAD')[0];
    var dirs       = returnData.getElementsByTagName('DIR');
    var videos     = returnData.getElementsByTagName('VID_FILE');
    var images     = returnData.getElementsByTagName('IMG_FILE');
    var files      = returnData.getElementsByTagName('FILE');
    var insertArea = document.getElementById('dynDiv');
    var workingDir = dirPath.innerHTML;
    var i          = 0;

    // Insert dirs
    document.getElementById("path").innerHTML = dirPath.innerHTML;
    insertArea.innerHTML = "";

    if (workingDir === "./") { var i = 2 }                 // Remove ,. and ../ if in "root"

    var size = dirs.length;
    for (; i < size; i++) {
        var dir = dirs[i].innerHTML;

        if (dir != "resources/") {
            insertArea.innerHTML += "<div class=\"dirStyle\" onclick=\"getDir('"
                                      + dir + "')\"  >"
                                      + dir
                                      + "</dir>";
        }
    }

    // Insert videos
    size = videos .length;
    for (i = 0; i < size; i++) {
        var thumbnail    = videos[i].children[0].innerHTML;
        var videoPth     = videos[i].children[1].innerHTML;
        var vidNme       = videos[i].children[2].innerHTML;

        insertArea.innerHTML += "<span class=\"movieStyle\" title=\"" + vidNme
                                  + "\" onclick='showMedia(\"" + videoPth + "\")'>"
                                  + "<img src=\"" + thumbnail + "\" alt=\"" + videoPth + "\">"
                                  + "<p class=\"movieTitle\">" + vidNme + "</p>"
                                  + "</span>";
    }

    // Insert images
    size = images.length;
    for (i = 0; i < size; i++) {
        var thumbnail    = images[i].children[0].innerHTML;
        var imgTitle     = images[i].children[1].innerHTML;

        if (!imgTitle.includes("favicon.png") && !imgTitle.includes("000.png") &&
            !imgTitle.includes("000.jpg") && !imgTitle.includes("000.gif")) {
                insertArea.innerHTML += "<img class=\"iconImg\" src=\""
                                          + thumbnail
                                          + "\" alt=\"" + imgTitle + "\""
                                          + "onclick='showImg(\"" + thumbnail + "\")'/>";
        }
    }

    if (images[0] != undefined) {
        if (images[0].children[0].innerHTML.includes("000.jpg") ||
            images[0].children[0].innerHTML.includes("000.png") ||
            images[0].children[0].innerHTML.includes("000.gif")) {
                updateBG(images[0].children[0].innerHTML);
        } else { updateBG("resources/images/backgrounds/000.jpg"); }
    } else {     updateBG("resources/images/backgrounds/000.jpg"); }

    // Insert files
    size = files.length;
    for (i = 0; i < size; i++) {
        var filePath    = files[i].children[0].innerHTML;
        var fileName    = files[i].children[1].innerHTML

        if (fileName != "sse.php" && fileName != "upload.php" &&
            fileName != "open.php" && fileName != "process.php") {
                insertArea.innerHTML += "<div class=\"fileStyle\" onclick=\"showMedia('"
                                          + filePath + "')\">" + fileName + "</dir>";
        }
    }
}
