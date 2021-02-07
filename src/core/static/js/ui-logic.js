// {% for file in files['files'] %}
// <div class="col-sm-12 col-md-6 col-lg-4">
//     <div class="card">
//         <div class="card-header">{{file[0]}}</div>
//         <div class="card-body">
//             <img class="image-style" src="/api/files/{{file[1]}}" alt="{{file[0]}}" />
//         </div>
//         <div class="card-footer">
//             <input app="{{file[1]}}" class="btn btn-secondary btn-sm" type="button" value="Launch"/>
//             <input app="{{file[1]}}" class="btn btn-secondary btn-sm" type="button" value="Launch Locally"/>
//         </div>
//     </div>
// </div>
// {% endfor %}



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
