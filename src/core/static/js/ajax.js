const listFilesAjax = async (hash) => {
    const data = "empty=NULL";
    doAjax("api/list-files/" + hash, data, "list-files");
}

const getFavesAjax = async () => {
    const data = "empty=NULL";
    doAjax("api/get-favorites", data, "favorites");
}

const loadFavoriteLink = async (id) => {
    const data = "empty=NULL";
    doAjax("api/load-favorite/" + id, data, "load-favorite");
}

const manageFavoritesAjax = async (action) => {
    const data = "empty=NULL";
    doAjax("api/manage-favorites/" + action, data, "manage-favorites");
}

const lockFoldersAjax = async () => {
    const data = "empty=NULL";
    doAjax("logout", data, "lock-folders");
}


const doAjax = (actionPath, data, action) => {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            if (this.responseText != null) {  // this.responseXML if getting XML data
                postAjaxController(JSON.parse(this.responseText), action);
            } else {
                let type = "danger"
                let msg  = "No content returned. Check the target path.";
                data     = '{"message": { "type": "' + type +  '", "text": "' + text + '" } }'
                postAjaxController(JSON.parse(data));
            }
        }
    };

    // xhttp.open("POST", formatURL(actionPath), true);
    xhttp.open("POST", actionPath, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    if (action === "list-files") {
        xhttp.setRequestHeader("Cache-Control", "no-cache, no-store");
        xhttp.setRequestHeader("Pragma", "no-cache");
        xhttp.setRequestHeader("Expires", "0");
    }

    // Force return to be JSON NOTE: Use application/xml to force XML
    xhttp.overrideMimeType('application/json');
    xhttp.send(data);
}

const fetchData = async (url) => {
    let response = await fetch(url);
    return await response.json();
}