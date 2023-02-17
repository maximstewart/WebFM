const img2TabElm = document.getElementById("img2Tab");
const ctxDownloadElm = document.getElementById("ctxDownload");
const menu       = document.querySelector(".menu");

let menuVisible  = false;
let img2TabSrc   = null;
let active_card  = null;

const img2Tab = () => {
    if (img2TabSrc !== null) {
        window.open(img2TabSrc,'_blank');
    }
};

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


document.body.addEventListener("click", e => {
    if(menuVisible) toggleMenu("hide");
});

document.body.addEventListener("contextmenu", e => {
    e.preventDefault();

    let target = e.target;
    let elm    = target;

    ctxDownloadElm.style.display = (elm.nodeName === "IMG" ||
                                    (elm.hasAttribute("ftype") &&
                                        (elm.getAttribute("ftype") === "file" ||
                                        elm.getAttribute("ftype") === "video" ||
                                        elm.getAttribute("ftype") === "image")
                                    )) ? "block" : "none";
    img2TabElm.style.display     = (elm.nodeName === "IMG") ? "block" : "none";
    img2TabSrc = (elm.nodeName === "IMG") ? elm.src : null;

    while (elm.nodeName != "BODY") {
        if (!elm.classList.contains("card")) {
            elm = elm.parentElement;
        } else {
            active_card = elm;
            break
        }
    }

    let posY = e.pageY;
    let posX = e.pageX - 165;

    if (e.pageY > (window.innerHeight - 120)) {
        posY = window.innerHeight - 220;
    }

    if (e.pageX > (window.innerWidth - 80)) {
        posX = window.innerWidth - 320;
    }

    if (e.pageX < 80) {
        posX = e.pageX + 180;
    }

    const origin = {
        left: posX,
        top: posY
    };

    setPosition(origin);
    return false;
});
