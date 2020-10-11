const manageFavorites = (elm) => {
    const classType = "btn-info";
    const hasClass  = elm.classList.contains(classType);
    if (hasClass) {
        elm.classList.remove(classType);
        action = "delete";
    } else {
        elm.classList.add(classType);
        action = "add";
    }

    let path = document.getElementById("path").innerHTML;
    manageFavoritesAjax(action, path);
}


const loadFave = (id) => {
    loadFavoriteLink(id);
}
