const insertArea = document.getElementById('dynDiv');


const handleXMLReturnData = (data) => {
    if (data.activeElement.tagName == "DIR_LIST") {
        updateHTMLDirList(data);
    } else if (data.activeElement.tagName == "LOCK_MESSAGE") {
        createPassField(data);
    } else if (data.activeElement.tagName == "SERV_MSG") {
        document.getElementById("serverMsgView").appendChild(data.activeElement);
    } else if (data.activeElement.tagName == "FAVES_LIST") {
        generateFavesList(data);
    }
}

const generateFavesList = (data) => {
    let listView        = document.getElementById("favesList");
    let favesList       = data.getElementsByTagName("FAVE_LINK");
    let size            = favesList.length;
    listView.innerHTML  = "";

    for (i = 0; i < size; i++) {
        let liTag   = document.createElement("LI");
        let name    = favesList[i].innerHTML;
        let parts   = (name.includes("/")) ? name.split("/") : name.split("\\");
        let txtNode = document.createTextNode(parts[parts.length - 2]);

        liTag.setAttribute("name", name);
        liTag.setAttribute("title", name);
        liTag.setAttribute("onclick", "loadFave(this)");
        liTag.appendChild(txtNode);
        listView.appendChild(liTag);
    }
}

const updateHTMLDirList = async (data) => {
    let isInFaves   = data.getElementsByTagName('IN_FAVE')[0].innerHTML;
    let dirPath     = data.getElementsByTagName('PATH_HEAD')[0].innerHTML;
    let dirs        = Array.prototype.slice.call(data.getElementsByTagName('DIR'), 0);
    let videos      = Array.prototype.slice.call(data.getElementsByTagName('VID_FILE'), 0);
    let images      = Array.prototype.slice.call(data.getElementsByTagName('IMG_FILE'), 0);
    let files       = Array.prototype.slice.call(data.getElementsByTagName('FILE'), 0);
    var dirTemplate = document.querySelector('#dirTemplate');
    var vidTemplate = document.querySelector('#vidTemplate');
    var imgTemplate = document.querySelector('#imgTemplate');
    var filTemplate = document.querySelector('#filTemplate');
    let i           = 0;
    let size        = 0;


    document.getElementById("path").innerHTML = dirPath;
    insertArea.innerHTML = "";

    // Setup background if there is a 000.* in selection
    let bgImgPth = images[0] ? images[0].innerHTML : "";
    if (bgImgPth.match(/000\.(jpg|png|gif)\b/) != null) {
        updateBG(dirPath + bgImgPth);
    } else {
        updateBG("resources/images/backgrounds/000.jpg");
    }

    // determin whether to style faves or not
    let elm = document.getElementById("faves");
    if (isInFaves == "true") {
        elm.style.backgroundColor = "rgb(255, 255, 255)";
        elm.style.color = "rgb(0, 0, 0)";
    } else {
        elm.style.backgroundColor = "";
        elm.style.color = "";
    }


    // Insert dirs
    let dirImg = "resources/images/icons/folder.png";
    size       = dirs.length;
    sortElms(dirs);
    for (; i < size; i++) {
        let dir = dirs[i].innerHTML;
        if (dir != "resources/") {
            let dirClone = document.importNode(dirTemplate.content, true);
            createElmBlock(dirClone, dirImg, dir);
        }
    }

    // Insert videos
    let thumbnail = "";
    let vidNme    = "";
    size          = videos.length;
    sortVidElms(videos);
    for (i = 0; i < size; i++) {
        vidNme        = videos[i].children[0].innerHTML;
        thumbnail     = videos[i].children[1].innerHTML;
        let vidClone  = document.importNode(vidTemplate.content, true);

        createElmBlock(vidClone, thumbnail, vidNme, true);
    }

    // Insert images
    thumbnail     = "";
    size          = images.length;
    sortElms(images);
    for (i = 0; i < size; i++) {
        thumbnail = images[i].innerHTML;
        if (thumbnail.match(/000\.(jpg|png|gif)\b/) == null &&
                             !thumbnail.includes("favicon.png")) {
            let imgClone = document.importNode(imgTemplate.content, true);
            let imgTag   = imgClone.firstElementChild;
            imgTag.src   = dirPath + thumbnail;
            imgTag.alt   = thumbnail;
            insertArea.appendChild(imgClone);
        }
    }

    // Insert files
    size = files.length;
    sortElms(files);
    for (i = 0; i < size; i++) {
        let filClone = document.importNode(filTemplate.content, true);
        let fileName = files[i].innerHTML;
        createElmBlock(filClone, setFileIconType(fileName), fileName);
    }
}

const sortVidElms = (obj) => {
    obj.sort(function(a,b) {
        var n1 = a.children[0].innerHTML;
        var n2 = b.children[0].innerHTML;
        if (n1 > n2) return 1;
        if (n1 < n2) return -1;
        return 0;
    });
}

const sortElms = (obj) => {
    obj.sort(function(a,b) {
        var n1 = a.innerHTML;
        var n2 = b.innerHTML;
        if (n1 > n2) return 1;
        if (n1 < n2) return -1;
        return 0;
    });
}

const createElmBlock = (elm, imgSrc, fileName, isVideo = null) => {
    contnrTag       = elm.firstElementChild;
    let imgTag      = null;
    let inputTag    = elm.querySelector("input");

    if (isVideo) {
        contnrTag.style = "background-image: url('" + imgSrc + "')";
        inputTag.className = "videoInputField";
    } else {
        imgTag      = elm.querySelector("img");
        imgTag.src  = imgSrc;
        imgTag.alt  = fileName;
    }

    contnrTag.title = fileName;
    inputTag.value  = fileName;
    inputTag.addEventListener("focusout", function (eve) {
        disableEdits(eve.target);
    });
    insertArea.appendChild(elm);
}

const setFileIconType = (fileName) => {
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
