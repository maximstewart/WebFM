const getTimeFormatted = (duration = null) => {
    if (duration == null) { return "00:00"; }

    let hours   = (duration / 3600).toFixed(2).split(".")[0];
    let minutes = (duration / 60).toFixed(2).split(".")[0];
    let time    = (duration / 60).toFixed(2)
    let seconds = Math.floor( (time - Math.floor(time) ) * 60);

    return hours + ":" + minutes + ":" + seconds;
}

const pauseVideo = () => {
    const video        = document.getElementById("video-viewer");
    video.style.cursor = '';
    video.pause();
}

const togglePlay = (video) => {
    shouldPlay = setTimeout(function () {
        let controls = document.getElementById("video-controls");
        shouldPlay   = null;
        if (video.paused) {
            video.style.cursor     = 'none';
            controls.style.display = "none";
            video.play();
        } else {
            video.style.cursor     = '';
            controls.style.display = "";
            video.pause();
        }
    }, 300);
}

const toggleFullscreen = (video) => {
    containerElm = document.getElementById("video-container");
    parentElm    = video.parentElement;

    if (video.requestFullscreen) {
        parentElm.requestFullscreen();
        video.style.cursor         = 'none';
        containerElm.style.display = "block";
    } else if (video.webkitRequestFullscreen) { /* Safari */
        parentElm.webkitRequestFullscreen();
        video.style.cursor         = 'none';
        containerElm.style.display = "block";
    } else if (video.msRequestFullscreen) {     /* IE11 */
        parentElm.msRequestFullscreen();
        video.style.cursor         = 'none';
        containerElm.style.display = "block";
    }

    if (fullScreenState == 2) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            video.style.cursor         = '';
            containerElm.style.display = "contents";
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
            video.style.cursor         = '';
            containerElm.style.display = "contents";
        } else if (document.msExitFullscreen) {     /* IE11 */
            document.msExitFullscreen();
            video.style.cursor         = '';
            containerElm.style.display = "contents";
        }

        fullScreenState = 0;
    }

    fullScreenState += 1;
}

const toggleVolumeControl = () => {
    const volume = document.getElementById("volume-slider");
    if (volume.style.display === "none") {
        volume.style.display = "";
    } else {
        volume.style.display = "none";
    }
}

const showControls = () => {
    const video    = document.getElementById("video-viewer");
    const controls = document.getElementById("video-controls");

    video.style.cursor     = '';
    controls.style.display = "";
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
    }

    controlsTimeout = setTimeout(function () {
        if (!video.paused) {
            if (canHideControls) {
                video.style.cursor     = 'none';
                controls.style.display = "none";
                controlsTimeout        = null;
            } else {
                showControls();
            }
        }
    }, 3000);
}


$("#video-viewer").on("loadedmetadata", function(eve){
    let video               = eve.target;
    let videoDuration       = document.getElementById("videoDuration");
    videoDuration.innerText = getTimeFormatted(video.duration);
});

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
    let videoDuration = document.getElementById("videoCurrentTime");
    const video       = eve.target;
    const seekto      = document.getElementById("seek-slider");
    const vt          = video.currentTime * (100 / video.duration);

    seekto.value            = vt;
    videoDuration.innerText = getTimeFormatted(video.currentTime);
});

$( "#seek-slider" ).bind( "change", async function(eve) {
    const slider = eve.target;
    let video    = document.getElementById("video-viewer");
    let seekto   = video.duration * (slider.value / 100);
    video.currentTime = seekto;
});

$( "#volume-slider" ).bind( "change", async function(eve) {
    const slider = eve.target;
    let video    = document.getElementById("video-viewer");
    let volumeto = slider.value;
    video.volume = volumeto;

});

$( "#video-controls" ).bind( "mouseenter", async function(eve) { canHideControls = false; });
$( "#video-controls" ).bind( "mouseleave", async function(eve) { canHideControls = true; });
