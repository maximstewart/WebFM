function dragContainer(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

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
