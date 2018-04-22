
function updateHTMLDirList(returnData) {
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
            insertArea.innerHTML += "<div class=\"dirStyle\"> <img id=\"dirID\""
                                      +" class=\"systemIcon\" src=\"resources/images/icons/folder.png\" />"
                                      + "<input type=\"text\" id=\"titleID\" class=\"dirTitle\""
                                      + " readonly=\"true\" value=\"" + dir + "\" "
                                      + " onfocusout=\"disableEdits(this)\"/>"
                                      +"</dir>";
        }
    }

    // Insert videos
    size = videos .length;
    for (i = 0; i < size; i++) {
        var thumbnail    = videos[i].children[0].innerHTML;
        var vidNme       = videos[i].children[1].innerHTML;

        insertArea.innerHTML += "<span class=\"movieStyle\" title=\"" + vidNme + "\" >"
                                  + "<img id=\"movieID\" class=\"thumbnail\""
                                  + " src=\"" + thumbnail + "\" alt=\"" + vidNme + "\" />"
                                  + "<input type=\"text\" id=\"titleID\" class=\"movieTitle\""
                                  + " readonly=\"true\"" + " value=\"" + vidNme + "\" "
                                  + " onfocusout=\"disableEdits(this)\"/>"
                                  + "</span>";
    }

    // Insert images
    var path   = document.getElementById("path").innerHTML;
    size       = images.length;

    for (i = 0; i < size; i++) {
        var thumbnail    = images[i].children[0].innerHTML;

        if (!thumbnail.includes("favicon.png") && !thumbnail.includes("000.png") &&
            !thumbnail.includes("000.jpg") && !thumbnail.includes("000.gif")) {
                insertArea.innerHTML += "<img id=\"imageID\" class=\"iconImg\""
                                          + " src=\"" + path + thumbnail
                                          + "\" alt=\"" + thumbnail + "\"/>";
        }
    }

    if (images[0] != undefined) {
        if (images[0].children[0].innerHTML.includes("000.jpg") ||
            images[0].children[0].innerHTML.includes("000.png") ||
            images[0].children[0].innerHTML.includes("000.gif")) {
                updateBG(path + images[0].children[0].innerHTML);
        } else {
            updateBG("resources/images/backgrounds/000.jpg");
        }
    } else {
        updateBG("resources/images/backgrounds/000.jpg");
    }

    // Insert files
    size = files.length;
    for (i = 0; i < size; i++) {
        var fileName = files[i].children[0].innerHTML;
        var iconImg = "<img id=\"fileID\"  class=\"systemIcon\"";

        if (fileName.includes(".doc") || fileName.includes(".docx") ||
            fileName.includes(".xls") || fileName.includes(".xlsx") ||
                                          fileName.includes(".rtf")) {
                iconImg += " src=\"resources/images/icons/doc.png\" />";
        } else if (fileName.includes(".7z") || fileName.includes(".7zip") ||
                   fileName.includes(".zip") || fileName.includes(".tar.gz") ||
                   fileName.includes(".tar.xz") || fileName.includes(".gz") ||
                   fileName.includes(".rar") || fileName.includes(".jar")) {
                iconImg += " src=\"resources/images/icons/arc.png\" />";
        } else if (fileName.includes(".pdf")) {
            iconImg += " src=\"resources/images/icons/pdf.png\" />";
        } else if (fileName.includes(".html")) {
            iconImg += " src=\"resources/images/icons/html.png\" />";
        } else if (fileName.includes(".txt") || fileName.includes(".conf")) {
            iconImg += " src=\"resources/images/icons/text.png\" />";
        } else if (fileName.includes(".iso") || fileName.includes(".img")) {
            iconImg += " src=\"resources/images/icons/img.png\" />";
        } else if (fileName.includes(".sh") || fileName.includes(".batch") ||
                  fileName.includes(".exe")) {
            iconImg += " src=\"resources/images/icons/scrip.png\" />";
        } else {
            iconImg += " src=\"resources/images/icons/bin.png\" />";
        }

        if (fileName != "sse.php" && fileName != "upload.php" &&
            fileName != "open.php" && fileName != "process.php") {
                insertArea.innerHTML += "<div class=\"fileStyle\">"
                                          + iconImg
                                          + "<input type=\"text\" id=\"titleID\" class=\"fileTitle\""
                                          + " readonly=\"true\"" + " value=\"" + fileName + "\" "
                                          + " onfocusout=\"disableEdits(this)\"/>"
                                          + "</dir>";
        }
    }
}
