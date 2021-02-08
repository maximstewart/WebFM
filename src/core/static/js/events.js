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

// Actions for content
// document.getElementById('file-grid').ondblclick = (event) => {
//     let target    = event.target;
//     let className = target.className;
//
//     // Left click detect
//     if (event.which == 1) {
//         // If clicking on container
//         if (className === "dir-style" || className === "video-style" ||
//             className === "file-style" || className === "image-style") {
//                 const title     = target.getAttribute("title");
//                 const hash      = target.getAttribute("hash");
//                 const parts     = title.split('.');
//                 const extension = "." + parts[parts.length - 1].toLowerCase();
//
//                 if (className === "dir-style") {
//                     listFilesAjax(hash);
//                 } else if (className === "video-style") {
//                     showMedia(hash, extension, "video");
//                 } else {
//                     showMedia(hash, extension, "file");
//                 }
//         }
//     }
// }







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
