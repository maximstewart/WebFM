window.onload = (eve) => {
    console.log("Loaded...");
}

document.body.onload = (eve) => {
    if (window.self !== window.top) {
        let elm = document.getElementById("bg");
        elm.parentElement.removeChild(elm);

        // Stylesheet for iframe views
        let  link = document.createElement("link");
        link.href = "static/css/iframe.css";
        link.type = "text/css";
        link.rel  = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    setTimeout(function () {
        getFavesAjax();
        reloadDirectory();
    }, 400);
}


const loadFavePath = (e) => {
    const target = e.target;
    const faveId = target.getAttribute("faveid");
    loadFavorite(faveId);
}

const openFile = (eve) => {
    let target = eve.target;
    if (!target.getAttribute("title"))
        target = target.parentElement

    const ftype     = target.getAttribute("ftype");
    const title     = target.getAttribute("title");
    const hash      = target.getAttribute("hash");
    const parts     = title.split('.');
    const extension = "." + parts[parts.length - 1].toLowerCase();

    if (ftype === "dir") {
        listFilesAjax(hash);
    } else if (ftype === "video") {
        showFile(title, hash, extension, "video");
    } else {
        showFile(title, hash, extension, "file");
    }
}

const openFileLocally = (eve) => {
    const target = eve.target;
    const hash   = target.getAttribute("hash");
    openWithLocalProgram(hash);
}




$( "#search-files-field" ).bind( "keyup", async function(eve) {
    searchPage();
});

$( "#clear-search-btn" ).bind( "click", async function(eve) {
    clearSearch();
});

$( "#refresh-btn" ).bind( "click", async function(eve) {
    reloadDirectory();
});

$( "#back-btn" ).bind( "click", async function(eve) {
    goUpADirectory();
});

$( "#tggl-faves-btn" ).bind( "click", async function(eve) {
    manageFavorites(eve.target);
});

$( "#scroll-files-to-top-btn" ).bind( "click", async function(eve) {
    scrollFilesToTop();
});

$( "#playlist-mode-btn" ).bind( "click", async function(eve) {
    togglePlaylistMode(eve.target);
});
