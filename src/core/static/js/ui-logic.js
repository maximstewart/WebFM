const reloadDirectory = () => {
    let target = document.getElementById('refresh-btn')
    const hash = target.getAttribute("hash");
    listFilesAjax(hash);
}

const goUpADirectory = () => {
    let target = document.getElementById('back-btn')
    const hash = target.getAttribute("hash");
    listFilesAjax(hash);
}

const scrollFilesToTop = () => {
    let target = document.getElementById('file-grid')
    target.scrollTop = 0;
}



const updateBackground = (srcLink, isvideo = true) => {
    try {
        let elm = document.getElementById("bg");
        if (isvideo) {
            if (elm.getAttribute('src') === "") {
                elm.src = srcLink;
            }
        } else {
            elm.src = "";
            elm.setAttribute("poster", srcLink);
        }
    } catch (e) {}
}


// Message handler
const displayMessage = (message, type, timeout, msgWindow = "page-alert-zone") => {
    let alertField  = document.getElementById(msgWindow);
    let divElm      = document.createElement("DIV");
    let btnElm      = document.createElement("BUTTON");
    let spnElm      = document.createElement("SPAN");
    let textElm     = document.createTextNode(message);

    divElm.setAttribute("class", "alert alert-" + type);
    divElm.setAttribute("role", "alert");
    divElm.appendChild(textElm);
    btnElm.type     = "button";
    textElm         = document.createTextNode("X");
    btnElm.setAttribute("class", "close");
    btnElm.setAttribute("data-dismiss", "alert");
    btnElm.setAttribute("aria-label", "close");
    spnElm.setAttribute("aria-hidden", "true");
    spnElm.appendChild(textElm);
    btnElm.appendChild(spnElm);
    divElm.appendChild(btnElm);
    alertField.appendChild(divElm);

    if (timeout > 0) {
        setTimeout(function () {
            clearChildNodes(alertField);
        }, timeout * 1000);
    }
}

const clearChildNodes = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


//Cache Buster
const clearCache = () => {
    var rep = /.*\?.*/,
    links   = document.getElementsByTagName('link'),
    scripts = document.getElementsByTagName('script'),
    links   = document.getElementsByTagName('video'),
    process_scripts = false;

    for (var i=0; i<links.length; i++) {
        var link = links[i],
        href = link.href;
        if(rep.test(href)) {
            link.href = href+'&'+Date.now();
        } else {
            link.href = href+'?'+Date.now();
        }

    }
    if(process_scripts) {
        for (var i=0; i<scripts.length; i++) {
            var script = scripts[i],
            src = script.src;
            if(rep.test(src)) {
                script.src = src+'&'+Date.now();
            } else {
                script.src = src+'?'+Date.now();
            }
        }
    }
}
