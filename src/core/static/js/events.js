window.onload = (eve) => {
    console.log("Loaded...");
}

document.body.onload = (eve) => {
    getFavesAjax();
    reloadDirectory();
}
