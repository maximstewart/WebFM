function showImg(imgLoc) {
    var imgView         = document.getElementById("imgView");
    var toPlayerButton  = "<div title=\"Open In Local Program\" class=\"popOutBttn\" onclick=\"openInLocalProg('" + imgLoc + "')\">&#8765;</div>";
    var popButton       = "<a href=\"" + imgLoc + "\" target=\"_blank\"><div class=\"popOutBttn\">&#8599;</div></a>";
    var CloseBttn       = "<div class=\"closeBttn\" onclick=\"closeImg()\">X</div>";

    imgView.style.display   = "block";
    imgView.innerHTML       = CloseBttn + popButton + toPlayerButton;
    imgView.innerHTML += "<div id=\"imgArea\"><img class=\"imgViewImg\" src=\"" + imgLoc + "\" /></div>";

    dragContainer(imgView);  // Set for dragging events
}

function showMedia(media) {
    var tempRef = media.toLowerCase();
    if (tempRef.includes(".mkv") || tempRef.includes(".avi") || tempRef.includes(".flv") ||
        tempRef.includes(".mov") || tempRef.includes(".m4v") || tempRef.includes(".mpg") ||
        tempRef.includes(".wmv") || tempRef.includes(".mpeg") || tempRef.includes(".psf")) {
            openInLocalProg(media);
    } else {
        var mediaView       = document.getElementById("fileView");
        var toPlayerButton  = "<div title=\"Open In Local Program\" class=\"popOutBttn\" onclick=\"openInLocalProg('" + media + "')\">&#8765;</div>";
        var popButton       = "<a title=\"New Tab\" href=\"" + media + "\" target=\"_blank\"><div class=\"popOutBttn\">&#8599;</div></a>";
        var CloseBttn       = "<div class=\"closeBttn\" title=\"Close\" onclick=\"closeMedia()\">X</div>";

        mediaView.style.display   = "block";
        mediaView.innerHTML       = CloseBttn + popButton + toPlayerButton;
        mediaView.innerHTML += "<iframe id=\"fileViewInner\" src=\"" + media + "\"></iframe>";

        dragContainer(mediaView);  // Set for dragging events
    }
}

function openInLocalProg(media) {
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", "resources/php/open.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("media=" + media);
}

function tgglServerMsgView() {
    var serverMsgView = document.getElementById("toggleServerMsg");
    if (serverMsgView.style.display == "none") {
        serverMsgView.style.display = "block";
    } else {
        serverMsgView.style.display = "none";
    }
}

function closeImg() {
    var imgView = document.getElementById("imgView");
    imgView.style.display = "none";
}

function closeMedia() {
    var mediaView = document.getElementById("fileView");
    mediaView.style.display = "none";
    mediaView.children[3].src = "";
}

function clearDirCookie() {
    var expireDate = "Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "dirQuery=; expires=" + expireDate;
    location.reload();
}

function onloadSetBG() { updateBG("resources/images/backgrounds/000.jpg"); }
function updateBG(bgImg) { document.getElementById("bg").src = bgImg; }


// SSE events if supported
if(typeof(EventSource) !== "undefined") {
    var source = new EventSource("resources/php/sse.php");
    source.onmessage = function(event) {
        if (event.data === "updateListing") {
            getDirSSE();
        }
    };
} else {
    console.log("SSE Not Supported In Browser...");
}
