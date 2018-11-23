let binary    = null;
let pathNodes = [];


const getDir = (query) => {
    let formUlPth  = document.getElementById("DIRPATHUL");
    let mergeType  = document.getElementById("MergeType");
    let passwd     = undefined;
    let data       = "";
    let cookies    = "";
    let dirCookie  = "";

    // push or pop to path list
    if (query === "/") {
        // Process path from cookie and set to array/list
        dirCookie = getCookie("dirQuery");
        if (dirCookie != "" && dirCookie != "./") {
            dirCookie = dirCookie.split("/");
            dirCookie.pop(); // account for ending empty slot

            let size = dirCookie.length;
            for (var i = 0; i < size; i++) {
                pathNodes.push(dirCookie[i] + "/");
            }
        } else {
            pathNodes = [];
            pathNodes.push("." + query);
        }
    } else if (query === "../") {
        // Only remove while not in root
        if (pathNodes.length > 1) {
            pathNodes.pop();
        }
    } else if (query === "./") {
        // Do nothing since re-scanning dir
    } else {
        pathNodes.push(query); // Add path
    }

    // Create path from array of items
    for (pathNode of pathNodes) { data += pathNode; }

    try {
        passwd = document.getElementById("PASSWD").value;
    } catch (e) {
        passwd = "";
    }

    // Setup upload path for form and make a cookie for persistence during browser session....
    formUlPth.value = data;
    data            = "dirQuery=" + encodeURIComponent(data);
    document.cookie = data + "; expires=Sun, 31 Dec 2034 12:00:00 UTC";
    data            +="&mergeType=" + mergeType.checked
                    + "Here&passwd=" + passwd;

    doAjax("resources/php/getDirList.php", data);
}

const uploadFiles = async () => {
    let toUpload = document.getElementsByName("filesToUpload[]")[0];
    let path     = document.getElementById("path").innerHTML;
    let reader   = new FileReader();
    let data     = new FormData();
    let size     = toUpload.files.length;

    data.append("UploadFiles", "trut");
    data.append("DIRPATHUL", path);

    // Add files
    if (size > 0) {
        for (let i = 0; i < size; i++) {
            data.append("filesToUpload[]", toUpload.files[i]);
        }
        fileUploader(data);
    }
}

const createItem = (type) => {
    let path      = document.getElementById("path").innerHTML;
    let newItem   = document.getElementById("NewItem");
    let fullPth   = path + newItem.value;
    newItem.value = "";
    fullPth       = encodeURIComponent(fullPth);

    doAjax("resources/php/filesystemActions.php",
           "createItem=true&item=" + fullPth + "&type=" + type);
}

const deleteItem = () => {
    let path = document.getElementById("path").innerHTML;
    // Clicked yes to delete and there is an item
    if (itemObj != undefined && itemObj != null) {
        let fullPth = path + itemObj;
        fullPth     = encodeURIComponent(fullPth);
        let answer  = confirm("Are you sure you want to delete: " + fullPth);
        if (answer == true) {
            doAjax("resources/php/filesystemActions.php",
                   "deleteItem=true&item=" + fullPth);

            console.log("Deleted:  " + fullPth);
            itemObj = null;
        }
    }
}

const renameItem = (obj) => {
    let path      = encodeURIComponent(document.getElementById("path").innerHTML);
    let oldName   = encodeURIComponent(formerFileName);
    let newName   = encodeURIComponent(obj.value);
    let formData  = "renameItem=true&oldName=" + oldName + "&newName=" + newName + "&path=" + path;

    console.log("Old name:  " + oldName);
    console.log("New name:  " + newName);

    doAjax("resources/php/filesystemActions.php",
            formData);
}

const openInLocalProg = (media) => {
    doAjax("resources/php/filesystemActions.php",
           "media=" + media);
}
