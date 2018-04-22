
function updateHTMLDirList(returnData) {
    var dirPath    = returnData.getElementsByTagName('PATH_HEAD')[0].innerHTML;
    var dirs       = returnData.getElementsByTagName('DIR');
    var videos     = returnData.getElementsByTagName('VID_FILE');
    var images     = returnData.getElementsByTagName('IMG_FILE');
    var files      = returnData.getElementsByTagName('FILE');
    var insertArea = document.getElementById('dynDiv');
    var size       = 0;
    var i          = 0;

    // Insert dirs
    document.getElementById("path").innerHTML = dirPath;
    insertArea.innerHTML = "";

    // Remove . and ../ if in "root"
    if (dirPath === "./") { i = 2 }

    size = dirs.length;
    for (; i < size; i++) {
        var dir = dirs[i].innerHTML;

        if (dir != "resources/") {
            insertArea.innerHTML +=
                "<div class=\"dirStyle\"> <img id=\"dirID\""
                    + " class=\"systemIcon\" src=\"resources/images/icons/folder.png\" />"
                    + "<input type=\"text\" id=\"titleID\" class=\"dirTitle\""
                    + " readonly=\"true\" value=\"" + dir + "\" "
                    + " onfocusout=\"disableEdits(this)\"/>"
                + "</dir>";
        }
    }

    // Insert videos
    var thumbnail    = "";
    var vidNme       = "";
    size             = videos .length;

    for (i = 0; i < size; i++) {
        thumbnail    = videos[i].children[0].innerHTML;
        vidNme       = videos[i].children[1].innerHTML;

        insertArea.innerHTML +=
            "<span class=\"movieStyle\" title=\"" + vidNme + "\" >"
                + "<img id=\"movieID\" class=\"thumbnail\""
                    + " src=\"" + thumbnail + "\" alt=\"" + vidNme + "\" />"
                + "<input type=\"text\" id=\"titleID\" class=\"movieTitle\""
                    + " readonly=\"true\"" + " value=\"" + vidNme + "\" "
                    + " onfocusout=\"disableEdits(this)\"/>"
            + "</span>";
    }

    // Insert images
    var path          = document.getElementById("path").innerHTML;
    var thumbnail     = ""
    size              = images.length;

    for (i = 0; i < size; i++) {
        thumbnail = images[i].children[0].innerHTML;

        if (thumbnail.match(/000\.(jpg|png|gif)\b/) == null &&
                         !thumbnail.includes("favicon.png")) {
                insertArea.innerHTML +=
                    "<img id=\"imageID\" class=\"iconImg\""
                        + " src=\"" + path + thumbnail
                        + "\" alt=\"" + thumbnail + "\"/>";
        }
    }

    // Setup background if there is a 000.* in selection
    var bgImgPth = images[0] ? images[0].children[0].innerHTML : "";
    if (bgImgPth.match(/000\.(jpg|png|gif)\b/) != null) {
        updateBG(path + bgImgPth);
    } else {
        updateBG("resources/images/backgrounds/000.jpg");
    }

    // Insert files
    size = files.length;
    for (i = 0; i < size; i++) {
        var fileName = files[i].children[0].innerHTML;
        var iconImg = "<img id=\"fileID\"  class=\"systemIcon\""
                        + setFileIconType(fileName);

        insertArea.innerHTML +=
            "<div class=\"fileStyle\">" + iconImg
            + "<input type=\"text\" id=\"titleID\" class=\"fileTitle\""
                + " readonly=\"true\"" + " value=\"" + fileName + "\" "
                + " onfocusout=\"disableEdits(this)\"/>"
            + "</dir>";
    }
}

function setFileIconType(fileName) {
    if (fileName.match(/\.(doc|docx|xls|xlsx|rtf)\b/) != null) {
        return " src=\"resources/images/icons/doc.png\" />";
    } else if (fileName.match(/\.(7z|7zip|zip|tar.gz|tar.xz|gz|rar|jar)\b/) != null) {
        return " src=\"resources/images/icons/arc.png\" />";
    } else if (fileName.match(/\.(pdf)\b/) != null) {
        return " src=\"resources/images/icons/pdf.png\" />";
    } else if (fileName.match(/\.(html)\b/) != null) {
        return " src=\"resources/images/icons/html.png\" />";
    } else if (fileName.match(/\.(txt|conf)\b/) != null) {
        return " src=\"resources/images/icons/text.png\" />";
    } else if (fileName.match(/\.(iso|img)\b/) != null) {
        return " src=\"resources/images/icons/img.png\" />";
    } else if (fileName.match(/\.(sh|batch|exe)\b/) != null) {
        return " src=\"resources/images/icons/scrip.png\" />";
    } else {
        return " src=\"resources/images/icons/bin.png\" />";
    }
}
