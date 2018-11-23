const faveManager = (elm) => {
    let path = document.getElementById("path").innerHTML;
    let data = "";

    if (elm.style.backgroundColor != "") {
        elm.style.backgroundColor = "";
        elm.style.color = "";
        data = "deleteLink=true";
    } else {
        elm.style.backgroundColor = "rgb(255, 255, 255)";
        elm.style.color = "rgb(0, 0, 0)";
        data = "deleteLink=false";
    }

    data += "&linkPath=" + path;
    doAjax("resources/php/dbController.php", data);
}

// Basically resetting path nodes and setting them up
// to the new path and just doing a refresh
const loadFave = (elm) => {
    let path  = elm.innerHTML;
    let parts = path.split("/");
    let size  = parts.length;
    pathNodes = [];

    pathNodes.push(parts[0] + "/");
    for (let i = 1; i < size - 1; i++) {
        pathNodes.push(parts[i] + "/");
    }
    pathNodes.push(parts[size - 1]);

    getDir("./");
}
