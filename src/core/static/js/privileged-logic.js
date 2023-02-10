
// Uploader Logic
const clearUlList = () => {
    const titles = document.getElementById('uploadListTitles');
    const files  = document.getElementById('toUpload');

    files.value = null;
    clearChildNodes(titles);
}

const setUploadListTitles = (files = null) => {
    if (files == null) {
        return ;
    }

    let list = document.getElementById('uploadListTitles');
    clearChildNodes(list);
    for (var i = 0; i < files.length; i++) {
        let liTag = document.createElement('LI');
        let name  = document.createTextNode(files[i].name);

        liTag.className = "list-group-item disabled progress-bar";
        let bs64  = btoa(unescape(encodeURIComponent(files[i].name))).split("==")[0];
        liTag.setAttribute("id", bs64);
        liTag.append(name);
        list.append(liTag);
    }
}


const uploadFiles = (files = null) => {
    const size = files.length;

    if (files == null || size < 1) {
        displayMessage("Nothing to upload...", "warning", "page-alert-zone-2");
        return ;
    }

    // Multi-upload...
    if (size > 1) {
        for (var i = 0; i < size; i++) {
            file = files[i];
            name = file.name;
            data = createFormDataFiles([file]);
            doAjaxUpload('api/upload', data, name, "upload-file");
        }
    } else { // Single upload...
        data = createFormDataFiles(files);
        name = files[0].name;
        doAjaxUpload('api/upload', data, name, "upload-file");
    }
}

const createFormDataFiles = (files) => {
    let form = new FormData();

    for (var i = 0; i < files.length; i++) {
        form.append(files[i].name, files[i]);
    }
    return form;
}

// Progressbar handler
const updateProgressBar = (progressbar = null, text = "Nothing uploading...",
                                            percent = 0, type = "error") => {
    if (progressbar == null) {
        return ;
    }


    if (type == "info") {
        progressbar.setAttribute("aria-valuenow", percent);
        progressbar.style.width = percent + "%";
        // progressbar.innerText   = text;
        progressbar.classList.remove('bg-success');
        progressbar.classList.add('progress-bar-animated');
        progressbar.classList.add('bg-info');
        return ;
    }

    if (type == "success") {
        progressbar.setAttribute("aria-valuenow", 100);
        progressbar.style.width = "100%";
        // progressbar.innerText   = text;
        progressbar.classList.remove('progress-bar-animated');
        progressbar.classList.remove('bg-info');
        progressbar.classList.add('bg-success');
        return ;
    }

    progressbar.style.width = "100%";
    progressbar.innerText   = "An Error Occured";
    progressbar.classList.remove('progress-bar-animated');
    progressbar.classList.remove('bg-info');
    progressbar.classList.remove('bg-success');
    progressbar.classList.add('bg-danger');
}
