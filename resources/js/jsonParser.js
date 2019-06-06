const insertArea = document.getElementById('dynDiv');


const handleJSONReturnData = (data) => {
    if (data.message) {
        if (data.message.type == "locked") {
            createPassField();
        } else {
            const text = document.createTextNode(data.message.text)
            document.getElementById("serverMsgView").appendChild(text);
        }
        return ;
    }

    if (data.list) {
        updateHTMLDirList(data);
    } else if (data.FAVES_LIST) {
        generateFavesList(data.FAVES_LIST);
    }
}

const generateFavesList = (data) => {
    let listView        = document.getElementById("favesList");
    listView.innerHTML  = "";

    data.forEach(fave => {
        let liTag   = document.createElement("LI");
        let parts   = (fave.includes("/")) ? fave.split("/") : fave.split("\\");
        let txtNode = document.createTextNode(parts[parts.length - 2]);

        liTag.setAttribute("name", fave);
        liTag.setAttribute("title", fave);
        liTag.setAttribute("onclick", "loadFave(this)");
        liTag.appendChild(txtNode);
        listView.appendChild(liTag);
    });
}

const updateHTMLDirList = async (data) => {
    var dirTemplate = document.querySelector('#dirTemplate');
    var vidTemplate = document.querySelector('#vidTemplate');
    var imgTemplate = document.querySelector('#imgTemplate');
    var filTemplate = document.querySelector('#filTemplate');
    let dirPath     = data.PATH_HEAD;
    let isInFaves   = data.IN_FAVE;
    let dirs        = (data.list.dirs)  ? data.list.dirs  : [];
    let videos      = (data.list.vids)  ? data.list.vids  : [];
    let images      = (data.list.imgs)  ? data.list.imgs  : [];
    let files       = (data.list.files) ? data.list.files : [];
    let i           = 0;
    let size        = 0;

    document.getElementById("path").innerHTML = dirPath;
    insertArea.innerHTML = "";

    // Setup background if there is a 000.* in selection
    let bgImgPth = images[0] ? images[0].image : "";
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
    let dirClone = document.importNode(dirTemplate.content, true);
    let dirImg   = "resources/images/icons/folder.png";
    let dir      = null;
    size         = dirs.length;
    for (; i < size; i++) {
        dir   = dirs[i].dir;
        const clone = dirClone.cloneNode(true);
        createElmBlock(clone, dirImg, dir);
    }

    // Insert videos
    let vidClone  = document.importNode(vidTemplate.content, true);
    let thumbnail = "";
    let title     = "";
    size          = videos.length;
    for (i = 0; i < size; i++) {
        title       = videos[i].video.title;
        thumbnail   = videos[i].video.thumbnail;
        const clone = vidClone.cloneNode(true);
        createElmBlock(clone, thumbnail, title, true, dirPath);
    }

    // Insert images
    let imgClone  = document.importNode(imgTemplate.content, true);
    thumbnail     = "";
    size          = images.length;
    for (i = 0; i < size; i++) {
        thumbnail = images[i].image;
        if (thumbnail.match(/000\.(jpg|png|gif)\b/) == null &&
                             !thumbnail.includes("favicon.png")) {
            const clone  = imgClone.cloneNode(true);
            let imgTag   = clone.firstElementChild;
            console.log(imgTag);
            imgTag.src   = dirPath + '/' + thumbnail;
            imgTag.alt   = thumbnail;
            insertArea.appendChild(clone);
        }
    }

    // Insert files
    let fileClone = document.importNode(filTemplate.content, true);
    size          = files.length;
    for (i = 0; i < size; i++) {
        const clone  = fileClone.cloneNode(true);
        let fileName = files[i].file;
        createElmBlock(clone, setFileIconType(fileName), fileName);
    }
}

const createElmBlock = (elm, imgSrc, fileName, isVideo = null, path = null) => {
    contnrTag       = elm.firstElementChild;
    let imgTag      = null;
    let inputTag    = elm.querySelector("input");

    if (isVideo) {
        contnrTag.style    = "background-image: url('/resources/images/thumbnails/" + imgSrc + "')";
        inputTag.className = "videoInputField";
        let fullMedia      = path + fileName;
        elm.querySelector("div").addEventListener("click", function (eve) {
            openInLocalProg(fullMedia);
        });
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
