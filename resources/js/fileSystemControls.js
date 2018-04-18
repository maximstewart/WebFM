var formerFileName = "";

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

function openInLocalProg(media) {
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", "resources/php/open.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("media=" + media);
}

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

function renameItem(obj) {
    var path      = document.getElementById("path").innerHTML;
    var oldName   = formerFileName;
    var newName   = obj.value;
    var formData  = "oldName=" + oldName + "&newName=" + newName + "&path=" + path;
    var xhttp     = new XMLHttpRequest();

    console.log("Old name:  " + oldName);
    console.log("New name:  " + newName);

    xhttp.open("POST", "resources/php/rename.php", false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formData);

    getDirSSE();
}

function createDir() {
    var path = document.getElementById("path").innerHTML;
    var newItem = document.getElementById("NewItem").value;
    var fullPth = path + newItem;
    var xhttp   = new XMLHttpRequest();

    xhttp.open("POST", "resources/php/newFileOrDir.php", false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("item=" + fullPth + "&isDir=dir");
    getDirSSE();
}

function createFile() {
    var path = document.getElementById("path").innerHTML;
    var newItem = document.getElementById("NewItem").value;
    var fullPth = path + newItem;

    var xhttp   = new XMLHttpRequest();

    xhttp.open("POST", "resources/php/newFileOrDir.php", false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("item=" + fullPth + "&isFile=file");
    getDirSSE();
}

function startDeleteItem(item) {
    // Get the item name
    itemObj = item;
}

function deleteItem(item) {
    var path = document.getElementById("path").innerHTML;

    // Clicked yes to delete and there is an item
    if (itemObj != undefined && itemObj != null) {
        var fullPth = path + itemObj;
        var answer = confirm("Are you sure you want to delete: " + fullPth);
        if (answer == true) {
            var xhttp   = new XMLHttpRequest();

            xhttp.open("POST", "resources/php/delete.php", false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("item=" + fullPth);

            console.log("Deleted:  " + fullPth);
            itemObj = null;
            getDirSSE();
        }
    }
}
