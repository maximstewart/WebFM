const insertArea = document.getElementById('dynDiv');


function handleXMLReturnData(data) {
    if (data.activeElement.tagName == "DIR_LIST") {
        updateHTMLDirList(data);
    } else if (data.activeElement.tagName == "LOCK_MESSAGE") {
        createPassField(data);
    } else if (data.activeElement.tagName == "SERV_MSG") {
        console.log(document.getElementById("serverMsgView"));
        document.getElementById("serverMsgView").appendChild(data.activeElement);
    }
}


async function updateHTMLDirList(data) {
    var isInFaves = data.getElementsByTagName('IN_FAVE')[0].innerHTML;
    var dirPath = data.getElementsByTagName('PATH_HEAD')[0].innerHTML;
    var dirs    = data.getElementsByTagName('DIR');
    var videos  = data.getElementsByTagName('VID_FILE');
    var images  = data.getElementsByTagName('IMG_FILE');
    var files   = data.getElementsByTagName('FILE');
    var dirImg  = "resources/images/icons/folder.png";
    var i       = 0;
    var size    = 0;

    // Insert dirs
    document.getElementById("path").innerHTML = dirPath;
    insertArea.innerHTML = "";

    // determin whether to style faves or nor
    if (isInFaves == "true") {
        var elm = document.getElementById("faves");
        elm.style.backgroundColor = "rgb(255, 255, 255)";
        elm.style.color = "rgb(0, 0, 0)";
    } else {
        var elm = document.getElementById("faves");
        elm.style.backgroundColor = "";
        elm.style.color = "";
    }

    size = dirs.length;
    for (; i < size; i++) {
        var dir = dirs[i].innerHTML;

        if (dir != "resources/") {
            createElmBlock("DIV", "dirStyle", "dirID", "systemIcon", dirImg ,
                                                            "dirTitle", dir);
        }
    }

    // Insert videos
    var thumbnail    = "";
    var vidNme       = "";
    size             = videos .length;

    for (i = 0; i < size; i++) {
        thumbnail     = videos[i].children[0].innerHTML;
        vidNme        = videos[i].children[1].innerHTML;
        createElmBlock("SPAN", "movieStyle", "movieID", "thumbnail", thumbnail,
                                                         "movieTitle", vidNme);
    }

    // Insert images
    var path       = document.getElementById("path").innerHTML;
    var thumbnail  = ""
    size           = images.length;

    for (i = 0; i < size; i++) {
        thumbnail = images[i].children[0].innerHTML;

        if (thumbnail.match(/000\.(jpg|png|gif)\b/) == null &&
                             !thumbnail.includes("favicon.png")) {
            var imgTag       = document.createElement("IMG");
            imgTag.id        = "imageID";
            imgTag.className = "iconImg";
            imgTag.src       = path + thumbnail;
            imgTag.alt       = thumbnail;
            insertArea.appendChild(imgTag);
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
        var fileName   = files[i].children[0].innerHTML;
        createElmBlock("DIV", "fileStyle", "fileID", "systemIcon", setFileIconType(fileName),
                                                                      "fileTitle", fileName);
    }
}

function createElmBlock(contnrType, contnrClass, imgID, imgClass,
                                    imgSrc, inputClass, fileName) {
    var contnrTag  = document.createElement(contnrType);
    var imgTag     = document.createElement("IMG");
    var inputTag   = document.createElement("INPUT");

    contnrTag.className  = contnrClass;
    contnrTag.title      = fileName;
    contnrTag.tabIndex   = "1";
    imgTag.id            = imgID;
    imgTag.className     = imgClass ;
    imgTag.src           = imgSrc;
    imgTag.alt           = fileName;
    inputTag.type        = "text";
    inputTag.id          = "titleID";
    inputTag.className   = inputClass;
    inputTag.readOnly    = "true";
    inputTag.value       = fileName;
    inputTag.addEventListener("focusout", disableEdits);

    contnrTag.appendChild(imgTag);
    contnrTag.appendChild(inputTag);
    insertArea.appendChild(contnrTag);
}

function setFileIconType(fileName) {
    if (fileName.match(/\.(doc|docx|xls|xlsx|rtf)\b/) != null) {
        return "resources/images/icons/doc.png";
    } else if (fileName.match(/\.(7z|7zip|zip|tar.gz|tar.xz|gz|rar|jar)\b/) != null) {
        return "resources/images/icons/arc.png";
    } else if (fileName.match(/\.(pdf)\b/) != null) {
        return "resources/images/icons/pdf.png";
    } else if (fileName.match(/\.(html)\b/) != null) {
        return "resources/images/icons/html.png";
    } else if (fileName.match(/\.(txt|conf)\b/) != null) {
        return "resources/images/icons/text.png";
    } else if (fileName.match(/\.(iso|img)\b/) != null) {
        return "resources/images/icons/img.png";
    } else if (fileName.match(/\.(sh|batch|exe)\b/) != null) {
        return "resources/images/icons/scrip.png";
    } else {
        return "resources/images/icons/bin.png";
    }
}
