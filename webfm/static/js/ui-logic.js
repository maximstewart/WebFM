let formerFileName = null;

const reloadDirectory = () => {
    let target = document.getElementById('refresh-btn')
    const hash = target.getAttribute("hash");
    listFilesAjax(hash);
}

const goUpADirectory = () => {
    let target = document.getElementById('back-btn')
    const hash = target.getAttribute("hash");
    listFilesAjax(hash);
}

const scrollFilesToTop = () => {
    let target = document.getElementById('file-grid')
    target.scrollTop = 0;
}


const showMedia = async (hash, extension, type) => {
    document.getElementById("image-viewer").style.display = "none";
    document.getElementById("text-viewer").style.display  = "none";
    document.getElementById("video-viewer").style.display = "none";
    document.getElementById("pdf-viewer").style.display   = "none";

    if (type === "video") {
        setupVideo(hash, extension);
    }
     if (type === "file") {
        setupFile(hash, extension);
    }
}

const setupVideo = async (hash, extension) => {
    let video           = document.getElementById("video-viewer");
    video.poster        = "static/imgs/icons/loading.gif";
    video.autoplay      = true;
    video.style.display = "";
    video_path          = "files/" + hash;

    try {
        if ((/\.(avi|mkv|wmv|flv|f4v|mov|m4v|mpg|mpeg|mp4|webm|mp3|flac|ogg)$/i).test(extension)) {
            if ((/\.(avi|mkv|wmv|flv|f4v)$/i).test(extension)) {
                data = await fetchData( "remux/" + hash );
                if ( data.hasOwnProperty('path') ) {
                    video_path = data.path;
                } else {
                    displayMessage(data.message.text, data.message.type)
                    return ;
                }
            } else if ((/\.(flv|mov|m4v|mpg|mpeg)$/i).test(extension)) {
                $('#file-view-modal').modal({"focus": false, "show": false});
                openWithLocalProgram(hash, extension);
                return ;
            }
        }

        if ((/\.(flv|f4v)$/i).test(extension)) {
            $('#file-view-modal').modal({"focus": true, "show": true});
            video.src    = video_path;
        } else {
            // This is questionable in usage since it loads the full video before
            // showing; but, seeking doesn't work otherwise...
            $('#file-view-modal').modal({"focus": true, "show": true});
            let response = await fetch(formatURL(video_path));
            let vid_src  = URL.createObjectURL(await response.blob()); // IE10+
            video.src    = vid_src;
        }
    } catch (e) {
        video.src           = "#";
        video.style.display = "none";
        console.log(e);
    }
}

const setupFile = async (hash, extension) => {
    let viewer = null;
    let type   = "local";

    if ((/\.(png|jpg|jpeg|gif|ico)$/i).test(extension)) {
        type   = "image";
        viewer = document.getElementById("image-viewer");
    }
    if ((/\.(txt|text|sh|cfg|conf)$/i).test(extension)) {
        type   = "text";
        viewer = document.getElementById("text-viewer");
    }
    if ((/\.(mp3|ogg|flac)$/i).test(extension)) {
        type   = "music";
        viewer = document.getElementById("video-viewer");
    }
    if ((/\.(pdf)$/i).test(extension)) {
        type   = "pdf";
        viewer = document.getElementById("pdf-viewer");
    }

    if (type !== "text" && type !== "local" ) {
        $('#file-view-modal').modal({"focus": true, "show": true});
        let response = await fetch(formatURL("files/" + hash));
        let src_obj  = URL.createObjectURL(await response.blob()); // IE10+
        viewer.src   = src_obj;
    }

    if (type == "text") {
        console.log(hash);
        let response = await fetch(formatURL("files/" + hash));
        let textData = await response.text(); // IE10+
        viewer.innerText = textData;
    }

    if (type !== "local") {
        viewer.style.display = "";
        $('#file-view-modal').modal({"focus": true, "show": true});
    }

    if (type == "local") {
        openWithLocalProgram(hash);
    }
}


const openWithLocalProgram = async (hash, extension = "") => {
    const url   = "run-locally/" + hash;
    let data    = await fetchData(url);
    let message = data.message;
    displayMessage(message.text, message.type);
}

// NOTE: Really should check who's requesting the lock action...meh.
// As is anyone can re-lock the specafied folders.
const lockFolders = () => {
    lockFoldersAjax();
    reloadDirectory();
}

const searchPage = () => {
    let query = document.getElementById('search-files-field').value.toLowerCase();
    let list  = document.getElementById("file-grid").querySelectorAll("[title]");
    let size  = list.length;

    for (var i = 0; i < size; i++) {
        if (!list[i].tagName.includes("SPAN")) {
            if (!list[i].title.toLowerCase().includes(query)) {
                list[i].style.display = "none";
            } else {
                list[i].style.display = "";
            }
        }
    }
}

const clearSearch = () => {
    let list  = document.getElementById("file-grid").querySelectorAll("[title]");
    let size  = list.length;

    document.getElementById('search-files-field').value = "";
    for (var i = 0; i < size; i++) {
        list[i].style.display = "";
    }
}

const enableEdit = (elm) => {
    console.log(elm);
    elm.style.backgroundColor  = "#ffffffff";
    elm.style.color            = '#000000ff';
    elm.readOnly               = '';
    formerFileName             = elm.value;
}

const disableEdit = (elm) => {
    elm.style.backgroundColor  = "";
    elm.style.color            = '';
    elm.value                  = formerFileName;
    elm.readOnly               = "true";
}

const updateBackground = (img_src) => {
    try {
        document.getElementById("bg").src = img_src;
    } catch (e) { }
}

// Message handler
const displayMessage = (message, type, timeout = 0, msgWindow = "page-alert-zone") => {
    let alertField  = document.getElementById(msgWindow);
    let divElm      = document.createElement("DIV");
    let btnElm      = document.createElement("BUTTON");
    let spnElm      = document.createElement("SPAN");
    let textElm     = document.createTextNode(message);

    divElm.setAttribute("class", "alert alert-" + type);
    divElm.setAttribute("role", "alert");
    divElm.appendChild(textElm);
    btnElm.type     = "button";
    textElm         = document.createTextNode("X");
    btnElm.setAttribute("class", "close");
    btnElm.setAttribute("data-dismiss", "alert");
    btnElm.setAttribute("aria-label", "close");
    spnElm.setAttribute("aria-hidden", "true");
    spnElm.appendChild(textElm);
    btnElm.appendChild(spnElm);
    divElm.appendChild(btnElm);
    alertField.appendChild(divElm);

    if (timeout > 0) {
        setTimeout(function () {
            clearChildNodes(alertField);
        }, timeout * 1000);
    }
}

const clearChildNodes = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
