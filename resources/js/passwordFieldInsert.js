const createPassField = (data) => {
    let passField         = document.createElement("INPUT");
    let submitBttn        = document.createElement("BUTTON");
    passField.id          = "PASSWD";
    passField.type        = "password";
    passField.placeholder = "Password...";
    submitBttn.innerHTML  = "Submit";
    insertArea.innerHTML  = "";

    passField.onkeyup = (eve) => {
        if (eve.key == "Enter") {
            getDir("./");
        }
    };

    submitBttn.onclick = () => {
        getDir("./");
    };

    insertArea.appendChild(passField);
    insertArea.appendChild(submitBttn);
}
