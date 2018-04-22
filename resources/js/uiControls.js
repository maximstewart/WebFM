
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

function clearDlList() {
    document.getElementById("CLEARBTTN").click();
}

function onloadSetBG() { updateBG("resources/images/backgrounds/000.jpg"); }
function updateBG(bgImg) { document.getElementById("bg").src = bgImg; }


// SSE events if supported
if(typeof(EventSource) !== "undefined") {
    var source = new EventSource("resources/php/sse.php");
    source.onmessage = function(event) {
        if (event.data === "updateListing") {
            getDir("./");
        }
    };
} else {
    console.log("SSE Not Supported In Browser...");
}
