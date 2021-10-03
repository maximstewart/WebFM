const createItem = (type) => {
    if (type == null || type == '') {
        displayMessage("Create type isn't set...", "danger", 3, "settings-alert-zone-new-items");
        return ;
    }

    let newItem   = document.getElementById("newItem");
    let fname     = newItem.value;

    const regex = /^[a-z0-9A-Z-_\[\]\(\)\| ]{4,20}$/;
    if (fname.search(regex) == -1) {
        displayMessage("A new item name can only contain alphanumeric, -, _, |, [], (), or spaces and must be minimum of 4 and max of 20 characters...", "danger", 3, "settings-alert-zone-new-items");
        return ;
    }

    newItem.value = "";
    createItemAjax(type, fname);
}


$( "#toUpload" ).bind( "change", function(eve) {
    const files = eve.target.files;
    setUploadListTitles(files);

});

$( "#uploadFiles" ).bind( "click", function(eve) {
    const files = document.getElementById('toUpload').files;
    uploadFiles(files);
});
