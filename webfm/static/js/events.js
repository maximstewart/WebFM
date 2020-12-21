let fullScreenState = 0;
let shouldPlay      = null;
let clicktapwait    = 200;


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


function togglePlay(video) {
    shouldPlay = setTimeout(function () {
        shouldPlay = null;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }, 300);
}

function toggleFullscreen(video) {
    containerElm = document.getElementById("video-container");
    parentElm    = video.parentElement;


    if (video.requestFullscreen) {
        parentElm.requestFullscreen();
        containerElm.style.display = "block";
    } else if (video.webkitRequestFullscreen) { /* Safari */
        parentElm.webkitRequestFullscreen();
        containerElm.style.display = "block";
    } else if (video.msRequestFullscreen) {     /* IE11 */
        parentElm.msRequestFullscreen();
        containerElm.style.display = "block";
    }

    if (fullScreenState == 2) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            containerElm.style.display = "contents";
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
            containerElm.style.display = "contents";
        } else if (document.msExitFullscreen) {     /* IE11 */
            document.msExitFullscreen();
            containerElm.style.display = "contents";
        }

        fullScreenState = 0;
    }

    fullScreenState += 1;
}

$("#video-viewer").on("click", function(eve){
    const video = eve.target;

    if(!shouldPlay) {
        shouldPlay = setTimeout( function() {
            shouldPlay = null;
            togglePlay(video);
        }, clicktapwait);
    } else {
        clearTimeout(shouldPlay); // Stop single tap callback
        shouldPlay = null;
        toggleFullscreen(video);
    }
    eve.preventDefault();
});

$("#video-viewer").on("touchend", function(eve){
    const video = eve.target;

    if(!shouldPlay) {
        shouldPlay = setTimeout( function() {
            shouldPlay = null;
            togglePlay(video);
        }, clicktapwait);
    } else {
        clearTimeout(shouldPlay); // Stop single tap callback
        shouldPlay = null;
        toggleFullscreen(video);
    }
    eve.preventDefault();
});

$( "#video-viewer" ).bind( "timeupdate", async function(eve) {
    const video  = eve.target;
    const seekto = document.getElementById("seek-slider");
    const vt     = video.currentTime * (100 / video.duration);
    seekto.value = vt;
});

$( "#seek-slider" ).bind( "change", async function(eve) {
    const slider = eve.target;
    let video    = document.getElementById("video-viewer");
    let seekto   = video.duration * (slider.value / 100);
    video.currentTime = seekto;

});




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

$( "#lock-folders-btn" ).bind( "click", async function(eve) {
    lockFolders();
});

$( "#scroll-files-to-top-btn" ).bind( "click", async function(eve) {
    scrollFilesToTop();
});


// Actions for content
document.getElementById('file-grid').ondblclick = (event) => {
    let target    = event.target;
    let className = target.className;

    // Left click detect
    if (event.which == 1) {
        // If clicking on container
        if (className === "dir-style" || className === "video-style" ||
            className === "file-style" || className === "image-style") {
                const title     = target.getAttribute("title");
                const hash      = target.getAttribute("hash");
                const parts     = title.split('.');
                const extension = "." + parts[parts.length - 1].toLowerCase();

                if (className === "dir-style") {
                    listFilesAjax(hash);
                } else if (className === "video-style") {
                    showMedia(hash, extension, "video");
                } else {
                    showMedia(hash, extension, "file");
                }
        }
    }
}
