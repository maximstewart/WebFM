// ondblclick
document.onclick = function (event) {
    var obj = event.target;
    var callingID = obj.id;
    var classNM = obj.className;

    // Left click detect
    if (event.which == 1) {
        if (callingID == "dirID") {
            var node = obj.parentNode;
            getDir(node.children[1].value);
        } else if (callingID == "movieID") {
            var node = obj.parentNode;
            showMedia(node.children[1].value);
        } else if (callingID == "fileID") {
            var node = obj.parentNode;
            showMedia(node.children[1].value);
        } else if (callingID == "imageID") {
            showImg(obj.alt);
        } else if (callingID == "titleID") {
            enableEdit(obj);
        }
    // Right click detect
    } else if (event.which == 3) {
        if (callingID == "imageID") {
           startDeleteItem(obj.alt);
       } else if (callingID == "dirID" || callingID == "fileID" ||
                                         callingID == "movieID") {
           var node = obj.parentNode;
           startDeleteItem(node.children[1].value);
       } else if (classNM == "fileStyle" || classNM == "dirStyle" ||
                                          classNM == "movieStyle") {
           startDeleteItem(obj.children[1].value);
       }
    }
}

document.onkeydown = function (event) {
    var obj = event.target;
    var callingID = event.target.id;
    var keyCodeVal = event.keyCode;

    // If keycode == Enter
    if (keyCodeVal == 13) {
        if (callingID == "titleID") {
            renameItem(obj);
        }
    }
}
