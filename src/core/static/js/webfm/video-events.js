let fullScreenState = 0;
let clicktapwait    = 200;
let shouldPlay      = null;
let controlsTimeout = null;
let playListMode    = false;
let videoPlaylist   = [];

const getTimeFormatted = (duration = null) => {
    if (duration == null) { return "00:00"; }

    const hours   = (duration / 3600).toFixed(2).split(".")[0];
    const minutes = (duration / 60).toFixed(2).split(".")[0];
    const time    = (duration / 60).toFixed(2)
    const seconds = Math.floor( (time - Math.floor(time) ) * 60);

    return hours + ":" + minutes + ":" + seconds;
}


const togglePlay = (video) => {
    shouldPlay = setTimeout(function () {
        shouldPlay = null;
        if (video.paused) {
            video.style.cursor = 'none';
            video.play();
        } else {
            video.style.cursor = '';
            video.pause();
        }
    }, 300);
}


const setFullscreenSettings = (parentElm, video) => {
    parentElm.requestFullscreen();
    video.classList.remove("viewer");
    video.style.cursor    = 'none';
    video.style.height    = 'inherit';
    video.style.width     = 'inherit';

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        video.style.transform = 'rotate(90deg)';
    }
}

const unsetFullscreenSettings = (video) => {
    video.classList.add("viewer");
    video.style.transform = '';
    video.style.cursor    = '';
    video.style.height    = '';
    video.style.width     = '';
}

const toggleFullscreen = (video) => {
    let containerElm = document.getElementById("video-container");
    let parentElm    = video.parentElement;

    if (video.requestFullscreen || video.webkitRequestFullscreen || video.msRequestFullscreen) {
        setFullscreenSettings(parentElm, video);
    }

    if (fullScreenState == 2) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            unsetFullscreenSettings(video);
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
            unsetFullscreenSettings(video);
        } else if (document.msExitFullscreen) {     /* IE11 */
            document.msExitFullscreen();
            unsetFullscreenSettings(video);
        }

        fullScreenState   = 0;
    }

    fullScreenState += 1;
}

const toggleVolumeControl = () => {
    const volume = document.getElementById("volume-slider");
    volume.style.display = (volume.style.display === "none") ? "" : "none";
}


const togglePlaylistMode = (elm) => {
    playListMode = elm.checked;
}

const previousMedia = () => {
    const current_title = document.getElementById('selectedFile').innerText;
    for (let i = videoPlaylist.length - 1; i >= 0; i--) {
        if (videoPlaylist[i].title === current_title) {
            const index = (i === 0) ? videoPlaylist.length - 1 : i-=1;
            clearModalFades();
            videoPlaylist[index].click();
            break
        }
    }
}

const nextMedia = () => {
    const current_title = document.getElementById('selectedFile').innerText;
    for (let i = 0; i < videoPlaylist.length; i++) {
        if (videoPlaylist[i].title === current_title) {
            const index = (i === videoPlaylist.length) ? 0 : i+=1;
            clearModalFades();
            videoPlaylist[index].click();
            break
        }
    }
}

const loadMediaToPlayer = (title = "", video_path = "") => {
    const modal  = new bootstrap.Modal(document.getElementById('file-view-modal'), { keyboard: false });
    const player = document.getElementById("video");
    player.src   = video_path;
    modal.show();
}




$("#video").on("loadedmetadata", function(eve){
    const video             = eve.target;
    let videoDuration       = document.getElementById("videoDuration");
    videoDuration.innerText = getTimeFormatted(video.duration);
});


$("#video").on("keydown", function(eve) {
    event.preventDefault();
    const key   = eve.keyCode;
    const video = eve.target;

    if (key === 37) {               // Left key for back tracking 5 sec
        video.currentTime -= 5;
    } else if (key === 39) {        // Right key for fast forward 5 sec
        video.currentTime += 5;
    } else if (key === 38) {        // Up key for volume up
        if (video.volume <= 1.0) {
            video.volume += 0.05;
        }
    } else if (key === 40) {        // Down key for volume down
        if (video.volume >= 0.0) {
            video.volume -= 0.05;
        }
    }

});


$("#video").on("keyup", function(eve) {
    const key   = eve.keyCode;
    const video = eve.target;

    if (key === 32 || key === 80) { // Spacebar for pausing
        togglePlay(video);
    } else if (key === 70) {        // f key for toggling full screen
        toggleFullscreen(video);
    } else if (key === 76) {        // l key for toggling loop
        if (myVideo.loop) {
            myVideo.loop = false;
        } else {
            myVideo.loop = true;
        }
    } else if (key === 77) {        // m key for toggling sound
        if (video.muted) {
            video.muted = false;
        } else {
            video.muted = true;
        }
    }
});


$("#video").on("click", function(eve){
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

$("#video").on("touchend", function(eve){
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

$( "#video").bind( "timeupdate", async function(eve) {
    let videoDuration = document.getElementById("videoCurrentTime");
    const video       = eve.target;
    const seekto      = document.getElementById("seek-slider");
    const vt          = video.currentTime * (100 / video.duration);

    seekto.value            = vt;
    videoDuration.innerText = getTimeFormatted(video.currentTime);
});

$( "#video").bind( "stalled", async function(eve) {
    console.log("Stalled load...");
});

$( "#seek-slider").bind( "change", async function(eve) {
    const slider = eve.target;
    let video    = document.getElementById("video");
    let seekto   = video.duration * (slider.value / 100);
    video.currentTime = seekto;
});

$( "#volume-slider").bind( "change", async function(eve) {
    const slider = eve.target;
    let video    = document.getElementById("video");
    let volumeto = slider.value;
    video.volume = volumeto;
});


$( "#video").bind( "ended", async function(eve) {
    if (!playListMode) {
        const video       = eve.target;
        const seekto      = document.getElementById("seek-slider");
        const vt          = video.currentTime * (100 / video.duration);

        seekto.value            = 0;
        videoDuration.innerText = getTimeFormatted(video.currentTime);
        video.play();
    } else {
        nextMedia();
    }
});


$( "#previousVideoInPlaylist").bind( "click", async function(eve) {
    previousMedia();
});


$( "#nextVideoInPlaylist").bind( "click", async function(eve) {
    nextMedia();
});
