// Context Menu items

const goHome = () => {
    goHomeAjax();
}

const downloadItem = (eve) => {
    let elm = active_card.querySelector('a');
    elm.click();
}

const deleteItem = (eve) => {
    if (active_card == null) {
        let text = "No card hovered over to delete!";
        let type = "danger";
        displayMessage(text, type, 3);
        return ;
    }

    let elm     = active_card.querySelector('[hash]');  // With attribute named "hash"
    let elm2    = active_card.querySelector('[title]'); // With attribute named "title"
    const hash  = elm.getAttribute("hash");
    const title = elm2.getAttribute("title");

    let res = confirm("Delete:  " + title + "  ?");
    if (res == true) {
      deleteItemAjax(hash);
    }
}



// Header menu items
const reloadDirectory = () => {
    const target = document.getElementById('refresh-btn');
    const hash   = target.getAttribute("hash");
    listFilesAjax(hash);
}

const goUpADirectory = () => {
    const target = document.getElementById('back-btn');
    const hash = target.getAttribute("hash");
    listFilesAjax(hash);
}

const scrollFilesToTop = () => {
    const target = document.getElementById('files');
    target.scrollIntoView();
}


const closeFile = async () => {
    const trailerPlayer = document.getElementById("trailerPlayer")
    let title           = document.getElementById("selectedFile");

    document.getElementById("video-container").style.display = "node";
    document.getElementById("image-viewer").style.display    = "none";
    document.getElementById("text-viewer").style.display     = "none";
    document.getElementById("pdf-viewer").style.display      = "none";
    player.jPlayer("pause")

    title.innerText             = "";
    trailerPlayer.src           = "#";
    trailerPlayer.style.display = "none";

    // FIXME: Yes, a wasted call every time there is no stream.
    await fetchData("api/stop-current-stream");
    clearSelectedActiveMedia();
    clearModalFades();
}

const showFile = async (title, hash, extension, type, target=null) => {
    document.getElementById("selectedFile").innerText        = title;
    document.getElementById("image-viewer").style.display    = "none";
    document.getElementById("text-viewer").style.display     = "none";
    document.getElementById("pdf-viewer").style.display      = "none";
    document.getElementById("video-container").style.display = "none";
    document.getElementById("trailerPlayer").style.display   = "none";


    // FIXME: Yes, a wasted call every time there is no stream.
    await fetchData("api/stop-current-stream");

    if (type === "video" || type === "stream") {
        isStream = (type === "stream") ? true : false;
        action   = (type === "stream") ? "stream" : "remux";
        setupVideo(hash, extension, isStream, action);
        setSelectedActiveMedia(target);
    } else if (type === "trailer") {
        launchTrailer(hash);
    } else {
        setupFile(hash, extension);
    }
}

const launchTrailer = (link) => {
    let modal                   = new bootstrap.Modal(document.getElementById('file-view-modal'), { keyboard: false });
    let trailerPlayer           = document.getElementById("trailerPlayer");
    trailerPlayer.style.display = "";
    trailerPlayer.src           = link;

    modal.show();
}

const setupVideo = async (hash, extension, isStream, action="remux") => {
    document.getElementById("video-container").style.display = "";
    video_path = `api/file-manager-action/files/${hash}`;

    clearSelectedActiveMedia();
     try {
        if (!isStream && !(/\.(avi|mkv|wmv|flv|f4v|mov|m4v|mpg|mpeg)$/i).test(extension)) {
            handleMedia(video_path);
            return;
        }

        if (!isStream && (/\.(mov|m4v|mpg|mpeg)$/i).test(extension)) {
            const msg = "Media Error: Please open mov|m4v|mpg|mpeg media locally or try streaming it..."
            displayMessage(msg, "warning", 5);
            return;
        }

        const data = await fetchData(`api/file-manager-action/${action}/${hash}`);
        displayMessage(data.message.text, data.message.type, 5);
    } catch (e) {
        video.style.display = "none";
        console.log(e);
    }
}

const handleMedia = async (video_path) => {
    const title = document.getElementById("selectedFile").innerText;
    loadMediaToPlayer(title, video_path);
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

const loadThumbnails = () => {
    fetchData("api/get-thumbnails").then((data) => {
        const cards_imgs = document.body.querySelectorAll('.card-image');
        const thumbnails = data["thumbnails"]
        for (var i = 0; i < cards_imgs.length; i++) {
            cards_imgs[i].src = "static/imgs/thumbnails/" + thumbnails[i][0] + ".jpg?d=" + Date.now();
        }
    });

}

const loadBackgroundPoster = () => {
    fetchData("api/get-background-poster-trailer").then((data) => {
        if (data.hasOwnProperty("trailer")) {
            let trailerBttn = document.getElementById("trailer-btn");
            let trailerLink = document.getElementById("trailer-link");
            if (data.trailer !== null) {
                trailerBttn.style.display     = "";
                trailerLink.href = `javascript: showFile( "Trailer", "${data.trailer}", "", "trailer" )`;
            } else {
                trailerBttn.style.display     = "none";
                trailerLink.href = "#";
            }

            if (data.poster !== null) {
                getSHA256Hash("000.jpg").then((_hash) => {
                    background_image = "api/file-manager-action/files/" + _hash + "?d=" + Date.now();
                    updateBackground(background_image, false);
                })
            }
        }
    });
}


const updateBackground = (srcLink, isvideo = true) => {
    try {
        const elm = document.getElementById("bg");
        setBackgroundElement(elm, srcLink);
    } catch (e) { }
}


const manageFavorites = (elm) => {
    const classType = "btn-warning";
    const hasClass  = elm.classList.contains(classType);
    if (hasClass) {
        action = "delete";
        elm.classList.remove(classType);
        elm.classList.add("btn-secondary");
    } else {
        action = "add";
        elm.classList.add(classType);
        elm.classList.remove("btn-secondary");
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

const clearModalFades = (elm) => {
    let elms = document.getElementsByClassName('modal-backdrop fade show');
    for (var i = 0; i < elms.length; i++) {
        elms[i].remove();
    }
}

const clearPlaylistMode = () => {
    const playListState = document.getElementById("playlist-mode-btn");
    if (playListState.checked) { playListState.click(); }
}

const setSelectedActiveMedia = (elm) => {
    clearSelectedActiveMedia();

    let card = elm;
    while (card.parentElement) {
        if (!card.classList.contains("card")) {
            card = card.parentElement;
            continue;
        }

        break
    }
    card.classList.add("selected-active-media");
}

const clearSelectedActiveMedia = () => {
    try {
        const elm = document.getElementsByClassName('selected-active-media')[0];
        elm.classList.remove("selected-active-media");
    } catch (e) {}
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

const getSHA256Hash = async (input) => {
  const textAsBuffer = new TextEncoder().encode(input);
  const hashBuffer   = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
  const hashArray    = Array.from(new Uint8Array(hashBuffer));
  const hash         = hashArray.map((item) => item.toString(16).padStart(2, "0")).join("");

  return hash.substring(0, 18);
};
