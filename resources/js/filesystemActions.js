var itemObj = undefined;

function renameItem(obj) {
    var path      = encodeURIComponent(document.getElementById("path").innerHTML);
    var oldName   = encodeURIComponent(formerFileName);
    var newName   = encodeURIComponent(obj.value);
    var formData  = "renameItem=true&oldName=" + oldName + "&newName=" + newName + "&path=" + path;

    console.log("Old name:  " + oldName);
    console.log("New name:  " + newName);

    doFSAction("resources/php/filesystemActions.php",
               formData);
}

function createItem(type) {
    var path      = document.getElementById("path").innerHTML;
    var newItem   = document.getElementById("NewItem");
    var fullPth   = path + newItem.value;
    newItem.value = "";
    fullPth       = encodeURIComponent(fullPth);

    doFSAction("resources/php/filesystemActions.php",
               "createItem=true&item=" + fullPth + "&type=" + type);
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
        var answer  = confirm("Are you sure you want to delete: " + fullPth);
        if (answer == true) {
            doFSAction("resources/php/filesystemActions.php",
                       "deleteItem=true&item=" + fullPth);

            console.log("Deleted:  " + fullPth);
            itemObj = null;
        }
    }
}

function openInLocalProg(media) {
    doFSAction("resources/php/filesystemActions.php",
               "media=" + media);
}

function doFSAction(actionPath, data) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", actionPath, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(data);
}
