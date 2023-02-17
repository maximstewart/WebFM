const postAjaxController = (data, action) => {
    if (data.message) {
        type    = data.message.type
        message = data.message.text

        if (action === "reset-path") {
            reloadDirectory();
            return ;
        }

        if (action === "delete-file") {
            reloadDirectory();
            displayMessage(message, type);
            return ;
        }

        if (action === "upload-text" || action === "upload-file") {
            let field = null;
            if (action === "upload-text") field = "settings-alert-zone-text";
            if (action === "upload-file") field = "settings-alert-zone-files";
            displayMessage(message, type, 3, field);
            reloadDirectory();
            return ;
        }

        if (action === "create-item") {
            displayMessage(message, type, 3, "settings-alert-zone-new-items");
            reloadDirectory();
            return ;
        }

        displayMessage(message, type);
        return ;
    }

    if (data.hasOwnProperty('path_head'))
        updateHTMLDirList(data);
    if (data.hasOwnProperty('faves_list'))
        renderFavesList(data);
    if (data.hasOwnProperty("refresh")) {
        if (data.refresh == "true") {
            reloadDirectory();
        }
    }
}



const updateHTMLDirList = async (data) => {
    let images           = data.list.images[0];
    let isInFaves        = data.in_fave;
    let background_image = (images[0]) ? images[0][0] : "";

    document.getElementById("path").innerText = data.path_head;
    // Setup background if there is a 000.* in selection
    if (background_image.match(/000\.(jpg|png|gif)\b/) != null) {
        // Due to same hash for 000 we add date to make link unique for each run to bypass cache issues...
        background_image = "api/file-manager-action/files/" + images[0][1] + '?d=' + Date.now();
        updateBackground(background_image, false);
    } else {
        loadBackground();
    }

    // Set faves state
    let tggl_faves_btn = document.getElementById("tggl-faves-btn");
    if (isInFaves == "true") {
        tggl_faves_btn.classList.remove("btn-secondary");
        tggl_faves_btn.classList.add("btn-warning");
    } else {
        tggl_faves_btn.classList.add("btn-secondary");
        tggl_faves_btn.classList.remove("btn-warning");
    }

    renderFilesList(data.list);
    loadBackgroundPoster();
    loadThumbnails();
}
