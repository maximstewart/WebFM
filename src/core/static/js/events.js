window.onload = (eve) => {
    console.log("Loaded...");
}

document.body.onload = (eve) => {
    getFavesAjax();
    reloadDirectory();
    if (window.self !== window.top) {
        setTimeout(function () {
            let elm = document.getElementById("bg");
            elm.parentElement.removeChild(elm);

            // Stylesheet for iframe views
            var link = document.createElement("link");
            link.href = formatURL("static/css/iframe.css");
            link.type = "text/css";
            link.rel = "stylesheet";
            document.getElementsByTagName("head")[0].appendChild(link);
        }, 500);
    }
}

const openFile = (eve) => {
    let target = eve.target;
    let hash   = target.getAttribute("app");
    listFilesAjax(hash);
}

const openFileLocally = (eve) => {
    let target = eve.target;
    let hash   = target.getAttribute("app");
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
