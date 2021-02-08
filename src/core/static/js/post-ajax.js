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
    console.log(data);
    let pathElm     = document.getElementById("path");
    let dirs        = (data.list.dirs)  ? data.list.dirs[0]  : [];
    let videos      = (data.list.vids)  ? data.list.vids[0]  : [];
    let images      = (data.list.images)  ? data.list.images[0]  : [];
    let files       = (data.list.ungrouped) ? data.list.ungrouped[0] : [];
    let isInFaves   = data.in_fave;

    console.log(data.list.images);
    let background_image = (images[0]) ? images[0][0] : "";
    console.log(background_image);

    pathElm.innerText = data.path_head; // Can still set the path info if locked...
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
    let elm = document.getElementById("tggl-faves-btn");
    if (isInFaves == "true")
        elm.classList.add("btn-info");
    else
        elm.classList.remove("btn-info");


    renderFilesList(data.list);

//     clearChildNodes(insertArea);
//     // Insert dirs
//     let dirClone  = document.importNode(dirTemplate.content, true);
//     let dir       = null;
//     size          = dirs.length;
//     for (; i < size; i++) {
//         const clone = dirClone.cloneNode(true);
//         title = dirs[i][0];
//         hash  = dirs[i][1];
//         createElmBlock(insertArea, clone, thumbnail, title, hash);
//     }
//
//     // Insert videos
//     let vidClone  = document.importNode(vidTemplate.content, true);
//     size          = videos.length;
//     for (i = 0; i < size; i++) {
//         const clone = vidClone.cloneNode(true);
//         title       = videos[i][0];
//         thumbnail   = formatURL(videos[i][1]);
//         hash        = videos[i][2];
//         createElmBlock(insertArea, clone, thumbnail, title, hash, true);
//     }
//
//     // Insert images
//     let imgClone  = document.importNode(imgTemplate.content, true);
//     thumbnail     = "";
//     size          = images.length;
//     for (i = 0; i < size; i++) {
//         title     = images[i][0];
//         thumbnail = formatURL("files/" + images[i][1]);
//         hash      = images[i][1];
//
//         if (thumbnail.match(/000\.(jpg|png|gif)\b/) == null &&
//             !thumbnail.includes("favicon.png") && !thumbnail.includes("000")) {
//             const clone  = imgClone.cloneNode(true);
//             createElmBlock(insertArea, clone, thumbnail, title, hash);
//         }
//     }
//
//     // Insert files
//     let fileClone = document.importNode(filTemplate.content, true);
//     size          = files.length;
//     for (i = 0; i < size; i++) {
//         const clone  = fileClone.cloneNode(true);
//         title     = files[i][0];
//         thumbnail = setFileIconType(files[i][0]);
//         hash      = files[i][1];
//         createElmBlock(insertArea, clone, thumbnail, title, hash);
//     }
// }
//
// const createElmBlock = (ulElm, clone, thumbnail, title, hash, isVideo=false) => {
//     let containerTag = clone.firstElementChild;
//     containerTag.setAttribute("style", "background-image: url('" + thumbnail + "')");
//     containerTag.setAttribute("title", title);
//     containerTag.setAttribute("hash", hash);
//
//     // If image tag this sink to oblivion since there are no input tags in the template
//     try {
//         let inputTag = clone.querySelector("input");
//         inputTag.setAttribute("value", title);
//         // NOTE: Keeping this just incase i do want to rename stuff...
//         //
//         // inputTag.addEventListener("dblclick", function (eve) {
//         //     enableEdit(eve.target);
//         // });
//         // inputTag.addEventListener("focusout", function (eve) {
//         //     disableEdit(eve.target);
//         // });
//     } catch (e) { }
//
//     if (isVideo) {
//         let popoutTag = clone.querySelector(".card-popout-btn");
//         popoutTag.setAttribute("hash", hash);
//         popoutTag.addEventListener("click", function (eve) {
//             let target = eve.target;
//             const hash = target.getAttribute("hash");
//             openWithLocalProgram(hash);
//         });
//     }
//
//
//     ulElm.appendChild(clone);
}

const setFileIconType = (fileName) => {
    icoPath = "";

    if (fileName.match(/\.(doc|docx|xls|xlsx|rtf)\b/) != null) {
        icoPath = "static/imgs/icons/doc.png";
    } else if (fileName.match(/\.(7z|7zip|zip|tar.gz|tar.xz|gz|rar|jar)\b/) != null) {
        icoPath = "resources/images/icons/arc.png";
    } else if (fileName.match(/\.(pdf)\b/) != null) {
        icoPath = "static/imgs/icons/pdf.png";
    } else if (fileName.match(/\.(html)\b/) != null) {
        icoPath = "static/imgs/icons/html.png";
    } else if (fileName.match(/\.(txt|conf)\b/) != null) {
        icoPath = "static/imgs/icons/text.png";
    } else if (fileName.match(/\.(iso|img)\b/) != null) {
        icoPath = "static/imgs/icons/img.png";
    } else if (fileName.match(/\.(sh|batch|exe)\b/) != null) {
        icoPath = "static/imgs/icons/scrip.png";
    } else {
        icoPath = "static/imgs/icons/bin.png";
    }

    return formatURL(icoPath)
}
