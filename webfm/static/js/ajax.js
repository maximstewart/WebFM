const listFilesAjax = async (hash) => {
    const data = "hash=" + hash;
    doAjax("list-files", data, "list-files");
}

const getFavesAjax = async () => {
    const data = "empty=NULL";
    doAjax("favorites", data, "favorites");
}

const loadFavoriteLink = async (id) => {
    const data = "id=" + id;
    doAjax("load-favorite", data, "load-favorite");
}

const manageFavoritesAjax = async (action, path) => {
    const data = "action=" + action + "&path=" + path;
    doAjax("manage-favorites", data, "manage-favorites");
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
                if (xhttp.responseURL.includes("/register") ||
                    xhttp.responseURL.includes("/login")) {
                        window.location.href = xhttp.responseURL;
                } else {
                    postAjaxController(JSON.parse(this.responseText), action);
                }
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
    // Force return to be JSON NOTE: Use application/xml to force XML
    xhttp.overrideMimeType('application/json');
    xhttp.send(data);
}

// used to get propper paths when domain changes and there are sub paths
const formatURL = (basePath) => {
    url = window.location.href;
    if ( url.endsWith('/') )
        return url + basePath;
    else
        return url + '/' + basePath;
}

const fetchData = async (url) => {
    let response = await fetch( formatURL(url) );
    return await response.json();
}
