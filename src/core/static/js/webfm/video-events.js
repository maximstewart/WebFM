let player          = null;
let playListMode    = false;
let videoPlaylist   = [];
let clicktapwait    = 200;
let shouldPlay      = null;


let jplayerOptions  = {
    solution: "html,aurora,flash",
    supplied: "m4v, ogv",
    cssSelectorAncestor: "#video-container",
    swfPath: "static/js/libs/jplayer/jquery.jplayer.swf",
    useStateClassSkin: true,
    loop: true,
    autoBlur: false,
    smoothPlayBar: true,
    remainingDuration: true,
    toggleDuration: true,
    ended: function() {
        if (!playListMode) {
            $(this).jPlayer("play");
        } else {
            nextMedia();
        }
    },
    keyEnabled: true,
    keyBindings: {
        play: {
            key: 32, // p
            fn: function(f) {
                if(f.status.paused) {
                    f.play();
                } else {
                    f.pause();
                }
            }
        },
        play2: {
            key: 80, // p
            fn: function(f) {
                if(f.status.paused) {
                    f.play();
                } else {
                    f.pause();
                }
            }
        },
        fullScreen: {
            key: 70, // f
            fn: function(f) {
                if(f.status.video || f.options.audioFullScreen) {
                    f._setOption("fullScreen", !f.options.fullScreen);
                }
            }
        },
        muted: {
            key: 77, // m
            fn: function(f) {
                f._muted(!f.options.muted);
            }
        },
        volumeUp: {
            key: 38, // UP Arrow
            fn: function(f) {
                f.volume(f.options.volume + 0.1);
            }
        },
        volumeDown: {
            key: 40, // DOWN Arrow
            fn: function(f) {
                f.volume(f.options.volume - 0.1);
            }
        },
        loop: {
            key: 76, // l
            fn: function(f) {
                f._loop(!f.options.loop);
            }
        },
        seekForward: {
            key: 39, // Right arrow
            fn: function(f) {
                f.playHead((f.status.currentPercentRelative + 5));
            }
        },
        seekBackward: {
            key: 37, // Left arrow
            fn: function(f) {
                f.playHead((f.status.currentPercentRelative - 5));
            }
        },
    }

}

if(/Android/i.test(navigator.userAgent)) {
    console.log("Using patched player for Android.");
    player = $("#video").jPlayerAndroidFix(jplayerOptions);
} else {
    console.log("Using regular player.");
    player = $("#video").jPlayer(jplayerOptions);

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

const togglePlaylistMode = (elm) => {
    playListMode = elm.checked;
    document.getElementsByClassName("jp-repeat")[0].click();
}

const loadMediaToPlayer = (title = "", video_path = "") => {
    if(/Android/i.test(navigator.userAgent)) {
        player.setMedia(video_path).play()
    } else {
        player.jPlayer("setMedia", {
            webmv: video_path,
            m4v: video_path,
            wav: video_path,
            ogv: video_path,
            rtmp: video_path,
            m3u8: video_path,
            webma: video_path,
            mp3: video_path,
            m4a: video_path,
            oga: video_path,
            fla: video_path,
            flv: video_path,
            title: title,
            poster: "static/imgs/icons/loading.gif"
        }).jPlayer("play");
    }
}

const doPlayOrFullscreen = (node) => {
    if (node.nodeName === "VIDEO") {
        if(!shouldPlay) {
            shouldPlay = setTimeout( function() {
                shouldPlay = null;
                document.getElementsByClassName("jp-play")[0].click();
            }, clicktapwait);
        } else {
            clearTimeout(shouldPlay); // Stop single tap callback
            shouldPlay = null;
            document.getElementsByClassName("jp-full-screen")[0].click();
        }
    }
}



player.on("click", function(eve){
    const node = eve.target;
    doPlayOrFullscreen(node);

});

player.on("touched", function(eve){
    const node = eve.target;
    doPlayOrFullscreen(node);
});

$( "#previousVideoInPlaylist").bind( "click", async function(eve) {
    previousMedia();
});

$( "#nextVideoInPlaylist").bind( "click", async function(eve) {
    nextMedia();
});
