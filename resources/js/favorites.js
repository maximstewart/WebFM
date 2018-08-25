function faveManager(elm) {
    var path = document.getElementById("path").innerHTML;
    var data = "";

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
