// ondblclick
document.ondblclick = function (event) {
    var obj       = event.target;
    var callingID = obj.id;
    var classNM   = obj.className;

    // Left click detect
    if (event.which == 1) {
        // If clicking on container
        if (classNM == "fileStyle" || classNM == "movieStyle" ||
                                      classNM == "dirStyle") {
            if (classNM == "dirStyle") {
                getDir(obj.children[1].value);
            } else {
                showMedia(obj.children[1].value);
            }
        // If clicking on dir icon
        } else if (callingID == "dirID") {
            var node = obj.parentNode;
            getDir(node.children[1].value);
        // If clicking on movie thumbnail
        } else if (callingID == "movieID") {
            var node = obj.parentNode;
            showMedia(node.children[1].value);
        // If clicking on file icon
        } else if (callingID == "fileID") {
            var node = obj.parentNode;
            showMedia(node.children[1].value);
        // If clicking on image
        } else if (callingID == "imageID") {
            showImg(obj.alt);
        // If clicking on text title
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

// Mainly for rename event
document.onkeydown = function (event) {
    var obj        = event.target;
    var callingID  = event.target.id;
    var keyCodeVal = event.keyCode;

    // If keycode == Enter
    if (keyCodeVal == 13) {
        if (callingID == "titleID") {
            renameItem(obj);
        }
    }
}

//  Drage event for the poped out image and media container
function dragContainer(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown  = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        pauseEvent(e);
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        pauseEvent(e);
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement(e) {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function pauseEvent(e) {
        if(e.stopPropagation) e.stopPropagation();
        if(e.preventDefault) e.preventDefault();

        e.cancelBubble=true;
        e.returnValue=false;
    return false;
    }
}
