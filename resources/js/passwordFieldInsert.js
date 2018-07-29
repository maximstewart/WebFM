function createPassField(returnData) {
    var msg = returnData.getElementsByTagName('MESSAGE')[0].innerHTML;
    console.log("No PATH_HEAD tag in XML. Checking for error MESSAGE tag.");
    console.log("Message:  " + msg);

    insertArea.innerHTML  = "";
    var passField         = document.createElement("INPUT");
    var submitBttn        = document.createElement("BUTTON");
    passField.id          = "PASSWD";
    passField.type        = "password";
    passField.placeholder = "Password...";
    submitBttn.innerHTML  = "Submit";

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
