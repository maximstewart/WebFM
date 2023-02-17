const getBackgrounds = async () => {
    const ulElm = document.getElementById('background-selection');
    const data  = await fetchData( "/backgrounds" );

    size        = data.backgrounds.length;
    backgrounds = data.backgrounds;
    for (var i = 0; i < size; i++) {
        generateBgElm(ulElm, backgrounds[i]);
    }
}

const generateBgElm = (ulElm, background) => {
    const liElm   = document.createElement("LI");
    const bgPath  = "/static/imgs/backgrounds/" + background;
    let elm       = document.createElement("VIDEO");

    elm = setBackgroundElement(elm, bgPath);
    elm.className = "bg-imgs";
    liElm.appendChild(elm);
    ulElm.appendChild(liElm);
}

const loadBackground = () => {
    const bgElm  = document.getElementById("bg");
    const bgPath = getCookie('bgSlug');

    if (!bgPath) {
        const path = '/static/imgs/backgrounds/background.png';
        setCookie('bgSlug', path);
        setBackgroundElement(bgElm, path);
    } else {
        // NOTE: Probably in IFRAME and unloaded the background...
        if (!bgElm) return ;
        setBackgroundElement(bgElm, bgPath);
    }
}

const setBackgroundCookie = (bgPath) => {
    const elm = document.getElementById("bg");
    setBackgroundElement(elm, bgPath);
    setCookie('bgSlug', bgPath);
}

const clearBackgroundList = () => {
    let bgList = document.getElementById("background-selection");
    clearChildNodes(bgList);
}

const setBackgroundElement = (elm, bgPath) => {
    if (bgPath.toLowerCase().endsWith(".mp4") ||
        bgPath.toLowerCase().endsWith(".webm")) {
            elm.src    = bgPath;
            elm.poster = "";
    } else {
        elm.src    = "";
        elm.poster = bgPath;
    }

    return elm;
}
