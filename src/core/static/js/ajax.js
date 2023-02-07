const goHomeAjax = async (hash) => {
    const data = "empty=NULL";
    clearPlaylistMode();
    clearSelectedActiveMedia();
    doAjax("api/file-manager-action/reset-path/None", data, "reset-path");
}

const deleteItemAjax = async (hash) => {
    const data = "empty=NULL";
    doAjax("api/file-manager-action/delete/" + hash, data, "delete-file");
}

const listFilesAjax = async (hash) => {
    const data = "empty=NULL";
    clearPlaylistMode();
    clearSelectedActiveMedia();
    doAjax("api/list-files/" + hash, data, "list-files");
}

const getFavesAjax = async () => {
    const data = "empty=NULL";
    doAjax("api/list-favorites", data, "favorites");
}

const loadFavoriteLink = async (id) => {
    const data = "empty=NULL";
    clearPlaylistMode();
    clearSelectedActiveMedia();
    doAjax("api/load-favorite/" + id, data, "load-favorite");
}

const manageFavoritesAjax = async (action) => {
    const data = "empty=NULL";
    doAjax("api/manage-favorites/" + action, data, "manage-favorites");
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

    // Force return to be JSON NOTE: Use application/xml to force XML
    xhttp.overrideMimeType('application/json');
    xhttp.send(data);
}

const doAjaxUpload  = (actionPath, data, fname, action) => {
    let bs64        = btoa(unescape(encodeURIComponent(fname))).split("==")[0];
    const query     = '[id="' + bs64 + '"]';
    let progressbar = document.querySelector(query);
    let xhttp       = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            if (this.responseText != null) {  // this.responseXML if getting XML data
                postAjaxController(JSON.parse(this.responseText), action);
            } else {
                msg = "[Fail] Status Code: " + response.status +
                        "\n[Message] --> "   + response.statusText;
                handleMessage('alert-warning', msg);
            }
        }
    };

    // For upload tracking with GET...
    xhttp.onprogress = function (e) {
        if (e.lengthComputable) {
            percent = (e.loaded / e.total) * 100;
            text    = parseFloat(percent).toFixed(2) + '% Complete (' + fname + ')';
            if (e.loaded !== e.total ) {
                updateProgressBar(progressbar, text, percent, "info");
            } else {
                updateProgressBar(progressbar, text, percent, "success");
            }
        }
    }

    // For upload tracking with POST...
    xhttp.upload.addEventListener("progress", function(e){
          if (e.lengthComputable) {
              percent = parseFloat( Math.floor(
                                    (
                                        (e.loaded / e.total) * 100 ).toFixed(2)
                                    ).toFixed(2)
                                );
              text    = percent + '% Complete (' + fname + ')';
              if (percent <= 95) {
                  updateProgressBar(progressbar, text, percent, "info");
              } else {
                  updateProgressBar(progressbar, text, percent, "success");
              }
          }
        }, false);

    xhttp.open("POST", actionPath);
    // Force return to be JSON NOTE: Use application/xml to force XML
    xhttp.overrideMimeType('application/json');
    xhttp.send(data);
}

const fetchData = async (url) => {
    return await fetch(url).then((response) => {
        if(response.status == 200) {
            return response.json();
        } else if (response.status == 504) {
            msg = "[Warning] Status Code: 504 Timeout\n[Message] --> Please wait for conversion to complete then try again.";
            return {'message': { 'type': "warning", 'text': msg} }
        } else {
            msg = "[Error] Status Code: " + response.status + "\n[Message] --> Network response was not ok...";
            return {'message': { 'type': "error", 'text': msg} }
        }
    }).catch(function(error) {
        let subStr1 = 'There has been a problem with your fetch operation: ' + error.message;
        msg = "[Error] Status Code: 000\n[Message] -->" + subStr1;
        return {'message': { 'type': "error", 'text': msg} }
    });
}
