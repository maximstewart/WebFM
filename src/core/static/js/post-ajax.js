const postAjaxController = (data, action) => {
    if (data.message) {
        message = data.message
        displayMessage(message.text, message.type);
        return ;
    }

    if (data.hasOwnProperty('path_head'))
        updateHTMLDirList(data);
    if (data.hasOwnProperty('faves_list'))
        // generateFavesList(data.faves_list);
        console.log("faves stub...");
    if (data.hasOwnProperty("refresh")) {
        if (data.refresh == "true") {
            reloadDirectory();
        }
    }
}


const generateFavesList = (data) => {
    let listView = document.getElementById("faves-list");
    clearChildNodes(listView);

    data.forEach(faveArry => {
        let fave    = faveArry[0]
        let faveId  = faveArry[1]
        let liTag   = document.createElement("LI");
        let parts   = (fave.includes("/")) ? fave.split("/") : fave.split("\\");

        let part = parts[parts.length - 1]
        if (part.toLowerCase().includes("season")) {
            part = parts[parts.length - 2] + "/" + part
        }

        let txtNode = document.createTextNode(part);
        liTag.setAttribute("class", "btn btn-secondary btn-sm");
        liTag.setAttribute("name", fave);
        liTag.setAttribute("title", fave);
        liTag.setAttribute("onclick", "loadFave(" + faveId +")");
        liTag.appendChild(txtNode);
        listView.appendChild(liTag);
    });
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
        background_image = "static/imgs/backgrounds/particles.mp4";
        updateBackground(background_image);
    }

    // See if in faves
    let tggl_faves_btn = document.getElementById("tggl-faves-btn");
    if (isInFaves == "true")
        tggl_faves_btn.classList.add("btn-info");
    else
        tggl_faves_btn.classList.remove("btn-info");


    renderFilesList(data.list);
}
