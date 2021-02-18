const ipRegexWithPort = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]\:?)$/;
const ipRegex         = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;



// Background Functions
const getBackgrounds = async () => {
    const ulElm = document.getElementById('backgroundSelection');
    const data  = await fetchData( formatURL("backgrounds") );

    size        = data.backgrounds.length - 1;
    backgrounds = data.backgrounds;
    for (var i = 0; i < size; i++) {
        generateBgElm(ulElm, backgrounds[i]);
    }
}

const generateBgElm = (ulElm, background) => {
    const liElm   = document.createElement("LI");
    const imgElm  = document.createElement("IMG");
    const imgPath = formatURL("static/imgs/backgrounds/" + background);

    imgElm.src   = imgPath;
    imgElm.className = "bgimgs";

    liElm.appendChild(imgElm);
    ulElm.appendChild(liElm);
}

const loadBackground = () => {
    let bgElm = document.getElementById("bg");
    let val   = getCookie('bgSlug');

    if (val == "" || val == undefined) {
        let path = formatURL('static/imgs/backgrounds/background.png');
        setCookie('bgSlug', path);
        bgElm.src = path;
    } else {
        bgElm.src = val;
    }
}

const setBackgroundCookie = (path) => {
    document.getElementById("bg").src = path;
    setCookie('bgSlug', path);
}

const clearBackgroundList = () => {
    let bgList = document.getElementById("backgroundSelection");
    clearChildNodes(bgList);
}

// Fave Modal and List Functions

const loadFavorites = async () => {
    const isLoggedIn = document.getElementsByClassName("btn btn-success")[0].innerText.includes("Login");
    if (!isLoggedIn) {
        const data  = await fetchData( formatURL("favorites") );
        const ulElm = document.getElementById('favoritesSelection');

        size        = data.faves.length;
        faves       = data.faves;
        for (var i = 0; i < size; i++) {
            generateFaveLinkElm(ulElm, faves[i][0], faves[i][1], faves[i][2]);
        }
    }
}

const setFaveLinkIco = (link) => {
    let iconElm  = document.getElementById("faveLinkImage");
    let gIcoElm  = document.getElementsByName('faveIconGoo')[0];
    let iIcoElm  = document.getElementsByName('faveIconIco')[0];
    let pIcoElm  = document.getElementsByName('faveIconPng')[0];
    let jIcoelm  = document.getElementsByName('faveIconJpg')[0];
    let gfIcoElm = document.getElementsByName('faveIconGif')[0];

    let gIcon    = 'http://www.google.com/s2/favicons?domain=';
    let dArry    = link.split('/');
    let iIcon    = "";
    let pIcon    = "";
    let jIcon    = "";
    let gfIcon   = "";

    // Check if we can see domain...
    if (dArry.length >= 3) {
        let domain = dArry[2];
        gIcon  = gIcon += domain;
        iIcon  = "//" + domain + "/favicon.ico";
        pIcon  = "//" + domain + "/favicon.png";
        jIcon  = "//" + domain + "/favicon.jpg";
        gfIcon = "//" + domain + "/favicon.gif";
    } else {
        // Check if IP
        if ( ipRegex.test(link) || ipRegexWithPort.test(link) ) {
            iIcon  = link + "/favicon.ico";
            pIcon  = link + "/favicon.png";
            jIcon  = link + "/favicon.jpg";
            gfIcon = link + "/favicon.gif";
        } else { // set generic fave icon.
            clearFaveIcons();
            return ;
        }
    }

    iconElm.src  = iIcon;
    gIcoElm.src  = gIcon;
    iIcoElm.src  = iIcon;
    pIcoElm.src  = pIcon;
    jIcoelm.src  = jIcon;
    gfIcoElm.src = gfIcon;
}

const clearFaveIcons = () => {
    const domain = "/static/imgs/icons/link-icon.png";
    document.getElementById("faveLinkImage").src     = domain;
    document.getElementsByName('faveIconGoo')[0].src = domain;
    document.getElementsByName('faveIconIco')[0].src = domain;
    document.getElementsByName('faveIconPng')[0].src = domain;
    document.getElementsByName('faveIconJpg')[0].src = domain;
    document.getElementsByName('faveIconGif')[0].src = domain;
    document.getElementsByName("customFaveIconImg")[0].src = domain;
}

const faveLinkFieldManager = (eve) => {
    const link    = eve.target.value.trim();
    const pattern = /(https|http)/ig;
    const result  = pattern.test(link);

    if (result === true) {
        setFaveLinkIco(link);
    }
}

const saveFaveLink = () => {
    const title = document.getElementById("faveTitleField").value.trim()
    const link  = document.getElementById("faveLinkField").value.trim()
    const icon  = document.getElementById("faveLinkImage").src;
    addFaveLinkAjax(title, icon, link);
}

const generateFaveLinkElm = async (ulElm, titleTxt, pathTxt, aTxt) => {
        const liElm   = document.createElement("LI");
        const aElm    = document.createElement("A");
        const imgElm  = document.createElement("IMG");
        const h3Elm   = document.createElement("H3");
        const title   = document.createTextNode(titleTxt);
        const imgPath = pathTxt;
        const aLink   = aTxt;

        aElm.href     = aLink;
        imgElm.title  = aLink;
        imgElm.src    = imgPath;
        imgElm.className = "faveimgs";

        h3Elm.appendChild(title)
        aElm.appendChild(imgElm);
        aElm.appendChild(h3Elm);
        liElm.appendChild(aElm);
        ulElm.appendChild(liElm);
}

const manageIcoCheckBoxs = (target = null) => {
    if (target == null)
        return ;

    let ulElm = document.getElementById('faveIcoUlList');
    let list  = ulElm.getElementsByTagName("INPUT");
    for (var i = 0; i < list.length; i++) {
        item = list[i];
        if (target.id != item.id) { // unceck all others
            item.checked = false;
        } else { // Act on target but insure one is checked at all times...
            if (!target.checked)
                target.checked = true;
                const src = target.nextElementSibling.nextElementSibling.src;
                document.getElementById("faveLinkImage").src = src;
        }
    }
}

const customIconFieldManager = (eve) => {
    let isChecked = document.getElementById('customIconChkBx').checked;
    if (isChecked) {
        let target = eve.target;
        const src = target.value.trim();
        document.getElementById("faveLinkImage").src = src;
        document.getElementsByName("customFaveIconImg")[0].src = src;
    }
}

const generateBackgroundDirectoryElm = (bgDirsList, name, path) => {
    let pthTxt  = document.createTextNode(name);
    let liElm   = document.createElement('LI');
    let spnElm  = document.createElement('SPAN');
    let spnElm2 = document.createElement('SPAN');

    liElm.className   = "list-group-item";
    liElm.setAttribute('title', path);
    liElm.setAttribute('class', "list-group-item");
    spnElm2.setAttribute('class', "badge badge-danger label-as-badge");
    spnElm2.setAttribute('value', path);
    spnElm2.addEventListener("click", eve => {
        removeBgFolder(eve.target);
    });

    spnElm2.innerText = "X";
    spnElm.appendChild(pthTxt);
    liElm.appendChild(spnElm);
    liElm.appendChild(spnElm2);
    bgDirsList.appendChild(liElm);
}

const getHackerNews = async () => {
    const response = await fetch("https://hacker-news.firebaseio.com/v0/beststories.json");
    const ids      = await response.json();

    let table    = document.getElementById("hackerNewsTable");
    let arrySize = ids.length;
    let j        = 1;

    for (var i = 0; i < arrySize; i++) {
        let artJSON = "https://hacker-news.firebaseio.com/v0/item/" + ids[i] + ".json";
        generateNewsElm(table, artJSON, j);
        j++;
    }
}

const generateNewsElm = async (table, artJSON, j) => {
    const response    = await fetch(artJSON);
    const article     = await response.json();

    let trItem        = document.createElement("TR");
    let tdItemNumber  = document.createElement("TD");
    let tdItemLink    = document.createElement("TD");
    let anchorItem    = document.createElement("A");
    let numberText    = document.createTextNode(j);
    let titleText     = document.createTextNode(article["title"]);

    anchorItem.href   =  article["url"];
    anchorItem.target =  "_blank";

    anchorItem.appendChild(titleText);
    tdItemNumber.appendChild(numberText);
    tdItemLink.appendChild(anchorItem);

    trItem.setAttribute("scope", "row");
    trItem.appendChild(tdItemNumber);
    trItem.appendChild(tdItemLink);
    table.appendChild(trItem);
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
