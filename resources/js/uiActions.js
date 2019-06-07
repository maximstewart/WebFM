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
    let list  = document.getElementById("dynUl").querySelectorAll("[title]");
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
    let list = document.getElementById("dynUl").querySelectorAll("[title]");
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

const disableEdits = (elm) => {
    elm.style.backgroundColor  = "";
    elm.style.color            = '';
    elm.value                  = formerFileName;
    elm.readOnly               = "true";
}

const showMedia = async (mediaLoc, type) => {
    let iframe       = document.createElement("IFRAME");
    let video        = document.createElement("VIDEO");
    let outterDiv    = document.createElement("DIV");
    let popOutDiv    = document.createElement("DIV");
    let closeDiv     = document.createElement("DIV");
    let toLocDiv     = document.createElement("DIV");
    let imgDiv       = document.createElement("DIV");
    let aTag         = document.createElement("A");
    let imgTag       = document.createElement("IMG");
    let closeText    = document.createTextNode("X");
    let path         = document.getElementById("path").innerHTML;
    let tempRef      = mediaLoc.toLowerCase();
    let fullMedia    = path + mediaLoc;

    closeDiv.className  = "closeBttn";
    closeDiv.title      = "Close";
    closeDiv.setAttribute("onclick", "closeContainer(this)");
    closeDiv.appendChild(closeText);

    aTag.title          = "New Tab";
    aTag.target         = "_blank";
    aTag.href           = fullMedia;

    popOutDiv.className = "popOutBttn";
    popOutDiv.innerHTML = "&#8599;";
    aTag.appendChild(popOutDiv);

    toLocDiv.title      = "Open In Local Program";
    toLocDiv.className  = "popOutBttn";
    toLocDiv.innerHTML  = "&#8765;";
    toLocDiv.setAttribute("onclick", "openInLocalProg('" + fullMedia + "')");

    imgDiv.id           = "imgArea";
    imgTag.className    = "imgViewImg";
    imgTag.src          = fullMedia;
    imgDiv.appendChild(imgTag);

    if ((/\.(mkv|avi|flv|mov|m4v|mpg|wmv|mpeg|mp4|mp3|webm|flac|ogg|pdf)$/i).test(tempRef)) {
        if ((/\.(mkv|avi|wmv)$/i).test(tempRef)) {
            const params = "remuxVideo=true&mediaPth=" + fullMedia;
            let response = await  fetch("resources/php/filesystemActions.php",
                                        {method: "POST", body: new URLSearchParams(params)});
            let xml      = new window.DOMParser().parseFromString(await response.text(), "text/xml");

            if (xml.getElementsByTagName("REMUX_PATH")[0]) {
                fullMedia = xml.getElementsByTagName("REMUX_PATH")[0].innerHTML;
            } else {
                return ;
            }
        } else if ((/\.(avi|flv|mov|m4v|mpg|wmv)$/i).test(tempRef)) {
            openInLocalProg(fullMedia);
            return ;
        }
    }

    iframe.id           = "fileViewInner";
    iframe.src          = fullMedia;

    video.controls      = true
    video.autoplay      = true;
    video.style         = "width: 100%; height: auto;";
    video.poster        = "resources/images/loading.gif";

    outterDiv.appendChild(closeDiv);
    outterDiv.appendChild(aTag);
    outterDiv.appendChild(toLocDiv);

    if (type === "image") {
        outterDiv.id = "imgView";
        outterDiv.appendChild(imgDiv);
    } else if (type === "video") {
        outterDiv.id = "fileView";
        outterDiv.appendChild(video);
    } else {
        outterDiv.id = "fileView";
        outterDiv.appendChild(iframe);
    }

    document.body.appendChild(outterDiv);
    dragContainer(outterDiv);  // Set for dragging events

    if (type === "video") {
        // This is questionable in usage since it loads the full video
        // before showing; but, seeking doesn't work otherwise...
        // video.src    = fullMedia;
        let response = await fetch(fullMedia, {method: "GET"});
        var vidSrc   = URL.createObjectURL(await response.blob()); // IE10+
        video.src    = vidSrc;
    }
}

const closeContainer = (elm) => {
    elm.parentElement.parentElement.removeChild(elm.parentElement);
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

const updateBG = (bgImg) => {
    try {
        document.getElementById("bg").src = bgImg;
    } catch (e) { }
}
