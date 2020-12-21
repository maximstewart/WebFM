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

    manageFavoritesAjax(action);
}


const loadFave = (id) => {
    loadFavoriteLink(id);
    document.getElementById("favorites-modal")
            .getElementsByClassName("modal-footer")[0]
            .children[0].click()
}
