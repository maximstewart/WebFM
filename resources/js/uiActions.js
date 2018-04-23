var formerFileName = "";

function enableEdit(obj) {
    obj.style.backgroundColor   = "#ffffffff";
    obj.style.color             = '#000000ff';
    obj.readOnly                = '';
    formerFileName              = obj.value;
}

function disableEdits(obj) {
    obj.style.backgroundColor   = "#ffffff00";
    obj.style.color             = '#ffffff';
    obj.value                   = formerFileName;
    obj.readOnly                = "true";
}

function showImg(imgLoc) {
    var path               = document.getElementById("path").innerHTML;
    var imgView            = document.getElementById("imgView");
    var fullImage          = path + imgLoc;
    var toPlayerButton     = "<div title=\"Open In Local Program\" class=\"popOutBttn\" onclick=\"openInLocalProg('" + fullImage + "')\">&#8765;</div>";
    var popButton          = "<a href=\"" + fullImage + "\" target=\"_blank\"><div class=\"popOutBttn\">&#8599;</div></a>";
    var CloseBttn          = "<div class=\"closeBttn\" onclick=\"closeImg()\">X</div>";
    imgView.style.display  = "block";
    imgView.innerHTML      = CloseBttn + popButton + toPlayerButton;

    imgView.innerHTML += "<div id=\"imgArea\"><img class=\"imgViewImg\" src=\"" + fullImage + "\" /></div>";
    dragContainer(imgView);  // Set for dragging events
}

function showMedia(media) {
    var path      = document.getElementById("path").innerHTML;
    var tempRef   = media.toLowerCase();
    var fullMedia = path + media;

    if (tempRef.includes(".mp4") || tempRef.includes(".webm") ||
        tempRef.includes(".mp3") || tempRef.includes(".ogg") ||
        tempRef.includes(".pdf") || tempRef.includes(".flac")) {
            var mediaView       = document.getElementById("fileView");
            var toPlayerButton  = "<div title=\"Open In Local Program\" class=\"popOutBttn\" onclick=\"openInLocalProg('" + fullMedia + "')\">&#8765;</div>";
            var popButton       = "<a title=\"New Tab\" href=\"" + fullMedia + "\" target=\"_blank\"><div class=\"popOutBttn\">&#8599;</div></a>";
            var CloseBttn       = "<div class=\"closeBttn\" title=\"Close\" onclick=\"closeMedia()\">X</div>";

            mediaView.style.display   = "block";
            mediaView.innerHTML       = CloseBttn + popButton + toPlayerButton;
            mediaView.innerHTML += "<iframe id=\"fileViewInner\" src=\"" + fullMedia + "\"></iframe>";

            dragContainer(mediaView);  // Set for dragging events
    } else {
        openInLocalProg(fullMedia);
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
    getDir("/");
}

function tgglServerMsgView() {
    var serverMsgView = document.getElementById("toggleServerMsg");
    if (serverMsgView.style.display == "none") {
        serverMsgView.style.display = "block";
    } else {
        serverMsgView.style.display = "none";
    }
}

function clearDlList() {
    document.getElementById("CLEARBTTN").click();
}

function onloadSetBG() {
    updateBG("resources/images/backgrounds/000.jpg");
}

function updateBG(bgImg) {
    document.getElementById("bg").src = bgImg;
}
