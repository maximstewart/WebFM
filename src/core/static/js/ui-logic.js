const reloadDirectory = () => {
    const target = document.getElementById('refresh-btn');
    const hash   = target.getAttribute("hash");
    listFilesAjax(hash);
}

const goUpADirectory = () => {
    const target = document.getElementById('back-btn')
    const hash = target.getAttribute("hash");
    listFilesAjax(hash);
}

const scrollFilesToTop = () => {
    const target = document.getElementById('files');
    target.scrollIntoView();
}


const closeFile = () => {
    const video = document.getElementById("video");
    let title   = document.getElementById("selectedFile");

    document.getElementById("image-viewer").style.display   = "none";
    document.getElementById("text-viewer").style.display    = "none";
    document.getElementById("pdf-viewer").style.display     = "none";
    document.getElementById("video-controls").style.display = "none";

    title.innerText     = "";
    video.style.display = "none";
    video.style.cursor  = '';
    video.pause();
}

const showFile = async (title, hash, extension, type) => {
    document.getElementById("image-viewer").style.display   = "none";
    document.getElementById("text-viewer").style.display    = "none";
    document.getElementById("pdf-viewer").style.display     = "none";
    document.getElementById("video").style.display          = "none";
    document.getElementById("video-controls").style.display = "none";

    let titleElm          = document.getElementById("selectedFile");
    titleElm.innerText    = title;

    if (type === "video") {
        setupVideo(hash, extension);
    }
     if (type === "file") {
        setupFile(hash, extension);
    }
}

const setupVideo = async (hash, extension) => {
    let video           = document.getElementById("video");
    let controls        = document.getElementById("video-controls");
    video.poster        = "static/imgs/icons/loading.gif";
    video.style.display = "";
    video.src           = "#"
    video_path          = "api/file-manager-action/files/" + hash;
    let modal           = new bootstrap.Modal(document.getElementById('file-view-modal'), { keyboard: false });


    try {
        if ((/\.(avi|mkv|wmv|flv|f4v|mov|m4v|mpg|mpeg|mp4|webm|mp3|flac|ogg)$/i).test(extension)) {
            if ((/\.(avi|mkv|wmv|flv|f4v)$/i).test(extension)) {
                data = await fetchData( "api/file-manager-action/remux/" + hash );
                if ( data.hasOwnProperty('path') ) {
                    video_path = data.path;
                } else {
                    displayMessage(data.message.text, data.message.type, 3);
                    return ;
                }
            } else if ((/\.(flv|mov|m4v|mpg|mpeg)$/i).test(extension)) {
                modal.hide();
                openWithLocalProgram(hash, extension);
                return ;
            }
        }

        modal.show();
        controls.style.display = "none";
        video.src              = video_path;
    } catch (e) {
        video.style.display = "none";
        console.log(e);
    }
}

const setupFile = async (hash, extension) => {
    let viewer = null;
    let type   = "local";
    let modal  = new bootstrap.Modal(document.getElementById('file-view-modal'), { keyboard: false });

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
        viewer = document.getElementById("video");
    }
    if ((/\.(pdf)$/i).test(extension)) {
        type   = "pdf";
        viewer = document.getElementById("pdf-viewer");
    }

    if (type !== "text" && type !== "local" ) {
        modal.show();
        let response = await fetch("api/file-manager-action/files/" + hash);
        let src_obj  = URL.createObjectURL(await response.blob()); // IE10+
        viewer.src   = src_obj;
    }

    if (type == "text") {
        let response     = await fetch("api/file-manager-action/files/" + hash);
        let textData     = await response.text(); // IE10+
        viewer.innerText = textData;
    }

    if (type !== "local") {
        viewer.style.display = "";
        modal.show();
    }

    if (type == "local") {
        openWithLocalProgram(hash);
    }
}


const openWithLocalProgram = async (hash, extension = "") => {
    const url   = "api/file-manager-action/run-locally/" + hash;
    const data  = await fetchData(url);
    let message = data.message;
    displayMessage(message.text, message.type, 3);
}


const searchPage = () => {
    const query = document.getElementById('search-files-field').value.toLowerCase();
    const list  = document.getElementById("files").querySelectorAll("li[title]");
    const size  = list.length;

    for (var i = 0; i < size; i++) {
        if (!list[i].title.toLowerCase().includes(query)) {
            list[i].style.display = "none";
        } else {
            list[i].style.display = "";
        }
    }
}

const clearSearch = () => {
    const list  = document.getElementById("files").querySelectorAll("li[title]");
    const size  = list.length;

    document.getElementById('search-files-field').value = "";
    for (var i = 0; i < size; i++) {
        list[i].style.display = "";
    }
}


const updateBackground = (srcLink, isvideo = true) => {
    try {
        let elm = document.getElementById("bg");
        if (isvideo) {
            if (elm.getAttribute('src') === "") {
                elm.src = srcLink;
            }
        } else {
            elm.src = "";
            elm.setAttribute("poster", srcLink);
        }
    } catch (e) { }
}


const manageFavorites = (elm) => {
    const classType = "btn-info";
    const hasClass  = elm.classList.contains(classType);
    if (hasClass) {
        elm.classList.remove(classType);
        action = "delete";
    } else {
        elm.classList.add(classType);
        action = "add";
    }

    manageFavoritesAjax(action);
}


const loadFavorite = (id) => {
    loadFavoriteLink(id);
    document.getElementById("favorites-modal")
            .getElementsByClassName("modal-footer")[0]
            .children[0].click()
}



// Message handler
const displayMessage = (message, type, timeout, msgWindow = "page-alert-zone") => {
    let alertField  = document.getElementById(msgWindow);
    let divElm      = document.createElement("DIV");
    let btnElm      = document.createElement("BUTTON");
    let spnElm      = document.createElement("SPAN");
    let textElm     = document.createTextNode(message);

    divElm.setAttribute("class", "alert alert-dismissible fade show alert-" + type);
    divElm.setAttribute("role", "alert");
    divElm.appendChild(textElm);
    btnElm.type     = "button";
    textElm         = document.createTextNode("X");
    btnElm.setAttribute("class", "btn-dark btn-close");
    btnElm.setAttribute("data-bs-dismiss", "alert");
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


// Cache Buster
const clearCache = () => {
    const rep = /.*\?.*/;
    let links     = document.getElementsByTagName('link'),
        scripts   = document.getElementsByTagName('script'),
        video     = document.getElementsByTagName('video'),
        process_scripts = false;

    for (let i = 0; i < links.length; i++) {
        let link = links[i],
        href = link.href;
        if(rep.test(href)) {
            link.href = href + '&' + Date.now();
        } else {
            link.href = href + '?' + Date.now();
        }

    }
    if(process_scripts) {
        for (let i = 0; i < scripts.length; i++) {
            let script = scripts[i],
            src = script.src;
            if(rep.test(src)) {
                script.src = src+'&'+Date.now();
            } else {
                script.src = src+'?'+Date.now();
            }
        }
    }
}
