let re = /(?:\.([^.]+))?$/;

const setFileIconType = (fileName) => {
    let icoPath = "static/imgs/icons/bin.png";
    let ftype   = "file";

    if (fileName.match(/\.(doc|docx|xls|xlsx|rtf)\b/) != null)
        icoPath = "static/imgs/icons/doc.png";
    if (fileName.match(/\.(7z|7zip|zip|tar.gz|tar.xz|gz|rar|jar)\b/) != null)
        icoPath = "resources/images/icons/arc.png";
    if (fileName.match(/\.(pdf)\b/) != null)
        icoPath = "static/imgs/icons/pdf.png";
    if (fileName.match(/\.(html)\b/) != null)
        icoPath = "static/imgs/icons/html.png";
    if (fileName.match(/\.(txt|conf)\b/) != null)
        icoPath = "static/imgs/icons/text.png";
    if (fileName.match(/\.(iso|img)\b/) != null)
        icoPath = "static/imgs/icons/img.png";
    if (fileName.match(/\.(sh|batch|exe)\b/) != null)
        icoPath = "static/imgs/icons/scrip.png";
    if (fileName.match(/\.(png|jpg|jpeg|gif|ico)\b/) != null)
        ftype   = "image";
    if (fileName.match(/\.(avi|mkv|wmv|flv|f4v|mov|m4v|mpg|mpeg|mp4|webm|mp3|flac|ogg)\b/) != null)
        ftype   = "video";
    if (fileName.match(/\.(dir)\b/) != null) {
        icoPath = "static/imgs/icons/folder.png";
        ftype   = "dir"
    }

    return [icoPath, ftype]
}

// Create a ES6 class component
class FilesList extends React.Component {
    // Use the render function to return JSX component

    constructor(props) {
      super(props);
      this.openThis = this.openThis.bind(this);
      this.openThisLocally = this.openThisLocally.bind(this);
    }

    openThis(e) {
        e.preventDefault();
        openFile(e);
    }

    openThisLocally(e) {
        e.preventDefault();
        openFileLocally(e);
    }

    render() {
        let final = [];
        let files = this.props.files[0];

        for (let file of files) {
            const name    = file[0];
            const hash    = file[1];
            let extension = re.exec( name.toLowerCase() )[1] ? name : "file.dir";
            let data      = setFileIconType(extension);
            let icon      = data[0];
            let filetype  = data[1];
            let card_header = null;
            let card_body   = null;

            if (filetype === "video") {
                card_header = name;
                card_body   = <img class="image-style" src={"static/imgs/thumbnails/" + hash + ".jpg"} alt={name} />;
            } else if (filetype === "image") {
                card_header = name;
                card_body   = <img class="image-style" src={"api/file-manager-action/files/" + hash} alt={name} />;
            } else {
                card_header = <img class="icon-style" src={icon} alt={name} />;
                card_body = name;

            }

            final.push(
                <div class="col-sm-12 col-md-6 col-lg-4">
                    <div class="card">
                        <div class="card-header">
                            {card_header}
                        </div>
                        <div class="card-body">
                            {card_body}
                        </div>
                        <div class="card-footer">
                            <input app={hash} onClick={this.openThisLocally} ftype={filetype} class="btn btn-secondary btn-sm float-left" type="button" value="Open Locally"/>
                            <input app={hash} onClick={this.openThis} ftype={filetype} class="btn btn-secondary btn-sm float-right" title={name} type="button" value="Open"/>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <React.Fragment>
                {final}
            </React.Fragment>
        );
    }
}

const renderFilesList = (data = null) => {
    const filesListElm = document.getElementById('files');
    ReactDOM.render(
        React.createElement(FilesList, data),
        filesListElm
    )
}
