var itemObj = undefined;

function renameItem(obj) {
    var path      = encodeURIComponent(document.getElementById("path").innerHTML);
    var oldName   = encodeURIComponent(formerFileName);
    var newName   = encodeURIComponent(obj.value);
    var formData  = "renameItem=true&oldName=" + oldName + "&newName=" + newName + "&path=" + path;
    var xhttp     = new XMLHttpRequest();

    console.log("Old name:  " + oldName);
    console.log("New name:  " + newName);

    xhttp.open("POST", "resources/php/filesystemActions.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formData);
}

function createItem(type) {
    var path      = document.getElementById("path").innerHTML;
    var newItem   = document.getElementById("NewItem");
    var fullPth   = path + newItem.value;
    var xhttp     = new XMLHttpRequest();
    newItem.value = "";
    fullPth       = encodeURIComponent(fullPth);

    xhttp.open("POST", "resources/php/filesystemActions.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("createItem=true&item=" + fullPth + "&type=" + type);
}

function startDeleteItem(item) {
    // Get the item name
    itemObj = item;
}

function deleteItem() {
    var path = document.getElementById("path").innerHTML;
    // Clicked yes to delete and there is an item
    if (itemObj != undefined && itemObj != null) {
        var fullPth = path + itemObj;
        fullPth     = encodeURIComponent(fullPth);
        var answer = confirm("Are you sure you want to delete: " + fullPth);
        if (answer == true) {
            var xhttp   = new XMLHttpRequest();

            xhttp.open("POST", "resources/php/filesystemActions.php", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("deleteItem=true&item=" + fullPth);

            console.log("Deleted:  " + fullPth);
            itemObj = null;
        }
    }
}

function openInLocalProg(media) {
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", "resources/php/filesystemActions.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("media=" + media);
}
