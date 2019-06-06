let itemObj = undefined;

// For context menu to have element
document.onclick = (event) => {
    let obj       = event.target;
    let callingID = obj.id;
    let classNM   = obj.className;

    // right-click detect
    if (event.which == 3) {
        if (callingID == "imageID") {
           setSelectedItem(obj.alt);
       } else if (callingID == "dirID" || callingID == "fileID" ||
                                         callingID == "movieID") {
           let node = obj.parentNode;
           setSelectedItem(node.children[1].value);
       } else if (classNM == "fileStyle" || classNM == "dirStyle" ||
                                          classNM == "movieStyle") {
           setSelectedItem(obj.children[1].value);
       }
    }
}
// Actions for content
document.ondblclick = (event) => {
    let obj       = event.target;
    let callingID = obj.id;
    let classNM   = obj.className;

    // Left click detect
    if (event.which == 1) {
        // If clicking on container
        if (classNM === "fileStyle" || classNM === "movieStyle" ||
                                        classNM === "dirStyle") {
            if (classNM === "dirStyle") {
                getDir(obj.children[1].value);
            } else if (classNM === "movieStyle") {
                console.log(obj);
                showMedia(obj.title, "video");
            } else {
                showMedia(obj.children[1].value, "file");
            }
        } else if (callingID === "dirID") {     // If clicking on dir icon
            let node = obj.parentNode;
            getDir(node.children[1].value);
        } else if (callingID === "movieID") {   // If clicking on movie thumbnail
            let node = obj.parentNode;
            showMedia(node.children[1].value, "video");
        } else if (callingID === "imageID") {   // If clicking on image
            showMedia(obj.alt, "image");
        } else if (callingID === "titleID") {   // If clicking on text title
            enableEdit(obj);
        }
    }
}

// Mainly for rename event
document.onkeydown = (event) => {
    let obj        = event.target;
    let callingID  = event.target.id;
    let keyCodeVal = event.keyCode;

    // If keycode == Enter
    if (keyCodeVal == 13) {
        if (callingID == "titleID") {
            renameItem(obj);
        }
    }
}

const setSelectedItem = (item) => { itemObj = item; }

//  Drage event for the poped out image and media container
const dragContainer = (elmnt) => {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
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
