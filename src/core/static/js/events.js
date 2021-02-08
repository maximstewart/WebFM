window.onload = (eve) => {
    console.log("Loaded...");
}

document.body.onload = (eve) => {
    getFavesAjax();
    reloadDirectory();
}

const openFile = (eve) => {
    let target = eve.target;
    let hash   = target.getAttribute("app");
    listFilesAjax(hash);
}

const openFileLocally = (eve) => {
    let target = eve.target;
    let hash   = target.getAttribute("app");
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
