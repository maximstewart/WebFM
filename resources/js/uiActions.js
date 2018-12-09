let formerFileName = "";

const tgglElmView = (id) => {
    let elm = document.getElementById(id);
    if (elm.style.display == "none") {
        elm.style.display = "block";
    } else {
        elm.style.display = "none";
    }
}

const searchPage = (elm) => {
    let query = elm.value.toLowerCase();
    let list  = document.getElementById("dynDiv").childNodes;
    let size  = list.length;

    for (var i = 0; i < size; i++) {
        if (!list[i].title.toLowerCase().includes(query)) {
            list[i].style.display = "none";
        } else {
            list[i].style.display = "";
        }
    }
}

const clearSearch = () => {
    let list = document.getElementById("dynDiv").childNodes;
    let size = list.length;

    for (var i = 0; i < size; i++) {
        list[i].style.display = "";
    }
}

const enableEdit = (obj) => {
    obj.style.backgroundColor  = "#ffffffff";
    obj.style.color            = '#000000ff';
    obj.readOnly               = '';
    formerFileName             = obj.value;
}

const disableEdits = () => {
    // this references the passed object from
    // addEventListener than us passing it
    this.style.backgroundColor  = "#ffffff00";
    this.style.color            = '#ffffff';
    this.value                  = formerFileName;
    this.readOnly               = "true";
}

const showImg = (imgLoc) => {
    let path               = document.getElementById("path").innerHTML;
    let imgView            = document.getElementById("imgView");
    let fullImage          = path + imgLoc;
    let toPlayerButton     = "<div title=\"Open In Local Program\" class=\"popOutBttn\" onclick=\"openInLocalProg('" + fullImage + "')\">&#8765;</div>";
    let popButton          = "<a href=\"" + fullImage + "\" target=\"_blank\"><div class=\"popOutBttn\">&#8599;</div></a>";
    let CloseBttn          = "<div class=\"closeBttn\" onclick=\"closeImg()\">X</div>";
    imgView.style.display  = "block";
    imgView.innerHTML      = CloseBttn + popButton + toPlayerButton;

    imgView.innerHTML += "<div id=\"imgArea\"><img class=\"imgViewImg\" src=\"" + fullImage + "\" /></div>";
    dragContainer(imgView);  // Set for dragging events
}

const showMedia = (media) => {
    let path      = document.getElementById("path").innerHTML;
    let tempRef   = media.toLowerCase();
    let fullMedia = path + media;

    if (tempRef.includes(".mp4") || tempRef.includes(".webm") ||
        tempRef.includes(".mp3") || tempRef.includes(".ogg") ||
        tempRef.includes(".pdf") || tempRef.includes(".flac")) {
            let mediaView       = document.getElementById("fileView");
            let toPlayerButton  = "<div title=\"Open In Local Program\" class=\"popOutBttn\" onclick=\"openInLocalProg('" + fullMedia + "')\">&#8765;</div>";
            let popButton       = "<a title=\"New Tab\" href=\"" + fullMedia + "\" target=\"_blank\"><div class=\"popOutBttn\">&#8599;</div></a>";
            let CloseBttn       = "<div class=\"closeBttn\" title=\"Close\" onclick=\"closeMedia()\">X</div>";

            mediaView.style.display = "block";
            mediaView.innerHTML     = CloseBttn + popButton + toPlayerButton;
            mediaView.innerHTML     += "<iframe id=\"fileViewInner\" src=\"" + fullMedia + "\"></iframe>";

            dragContainer(mediaView);  // Set for dragging events
    } else {
        openInLocalProg(fullMedia);
    }
}

const closeImg = () => {
    let imgView           = document.getElementById("imgView");
    imgView.style.display = "none";
}

const closeMedia = () => {
    let mediaView             = document.getElementById("fileView");
    mediaView.style.display   = "none";
    mediaView.children[3].src = "";
}

const clearDirCookie = () => {
    let expireDate = "Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "dirQuery=; expires=" + expireDate;
    getDir("/");
}

const downloadItem = () => {
    let partialPath = document.getElementById("path").innerHTML;
    let brTag       = document.createElement("BR");
    let aTag        = document.createElement("A");
    let text        = document.createTextNode(itemObj);
    let fullPath    = partialPath + itemObj;
    aTag.setAttribute("href", fullPath);
    aTag.setAttribute("target", "_blank");
    aTag.setAttribute("id", itemObj);
    aTag.append(text);

    document.getElementById("serverMsgView").append(aTag, brTag);
    aTag.click();
}

const clearDlList = () => {   document.getElementById("CLEARBTTN").click(); }
const onloadSetBG = () => {   updateBG("resources/images/backgrounds/000.jpg"); }
const updateBG = (bgImg) => { document.getElementById("bg").src = bgImg; }
