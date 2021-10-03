const menu      = document.querySelector(".menu");
let menuVisible = false;
let active_card = null;

const toggleMenu = command => {
    menu.style.display = command === "show" ? "block" : "none";
    menu.style.zIndex  = "9999";
    menuVisible        = !menuVisible;
};

const setPosition = ({ top, left }) => {
    menu.style.left = `${left}px`;
    menu.style.top  = `${top}px`;
    toggleMenu("show");
};

window.addEventListener("click", e => {
    if(menuVisible) toggleMenu("hide");
});

window.addEventListener("contextmenu", e => {
    e.preventDefault();

    let target = e.target;
    let elm    = target;
    while (elm.nodeName != "BODY") {
        if (!elm.classList.contains("card")) {
            elm = elm.parentElement;
        } else {
            active_card = elm;
            break
        }
    }

    const origin = {
        left: e.pageX,
        top: e.pageY
    };
    setPosition(origin);
    return false;
});
