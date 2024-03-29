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

class FilesList extends React.Component {
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
            if (name == "000.jpg") { continue }

            const hash      = file[1];
            const fsize     = file[2];
            let extension   = re.exec( name.toLowerCase() )[1] ? name : "file.dir";
            let data        = setFileIconType(extension);
            let icon        = data[0];
            let filetype    = data[1];
            let card_header = null;
            let card_body   = null;
            let download_button = null;
            let stream_button   = null;

            if (filetype === "video") {
                card_header = name;
                card_body   = <React.Fragment>
                                <img class="card-img-top card-image" src="" alt={name} />
                                <span class="float-right">{fsize}</span>
                            </React.Fragment>;
                stream_button =  <React.Fragment>
                                    <input hash={hash} onClick={this.openThis} ftype="stream" class="btn btn-dark btn-sm float-end" title={name} type="button"  value="Stream"/>
                                </React.Fragment>;

            } else if (filetype === "image") {
                card_header = name;
                card_body   = <React.Fragment>
                                <img class="card-img-top" src={"api/file-manager-action/files/" + hash + "?d=" + Date.now()} alt={name} />
                                <span class="float-right">{fsize}</span>
                            </React.Fragment>;
            } else {
                card_header = <img class="icon-style" src={icon} alt={name} />;
                card_body = <React.Fragment>
                                {name}
                                <span>{fsize}</span>
                            </React.Fragment>;
            }
            if (filetype !== "dir") {
                download_button = <React.Fragment>
                                    <a href={"api/file-manager-action/files/" + hash} download class="btn btn-dark btn-sm float-start">Download</a>
                                </React.Fragment>;
            }

            final.push(
                <li class="col-sm-12 col-md-6 col-lg-4" title={name}>
                    <div class="card">
                        <div class="card-header card-title-text">
                            {card_header}
                        </div>
                        <div class="card-body text-center noselect" title={name} hash={hash} ftype={filetype} onDoubleClick={this.openThis}>
                            {card_body}
                        </div>
                        <div class="card-footer">
                            {download_button}
                            <input hash={hash} onClick={this.openThisLocally} ftype={filetype} class="btn btn-dark btn-sm float-start" type="button" value="Open Locally"/>
                            <input hash={hash} onClick={this.openThis} ftype={filetype} class="btn btn-dark btn-sm float-end" title={name} type="button" value="Open"/>
                            {stream_button}
                        </div>
                    </div>
                </li>
            );
        }

        return (
            <React.Fragment>
                {final}
            </React.Fragment>
        );
    }
}


class FavoritesList extends React.Component {
    constructor(props) {
      super(props);
      this.loadFaveEvent = this.loadFaveEvent.bind(this);
    }

    loadFaveEvent(e) {
        e.preventDefault();
        loadFavePath(e);
    }

    render() {
        let final = [];
        let faves = this.props.faves_list;

        for (let fave of faves) {
            let title   = fave[0]
            let _faveId = fave[1]
            let liTag   = document.createElement("LI");
            let parts   = (title.includes("/")) ? title.split("/") : title.split("\\");

            let name = parts[parts.length - 1]
            if (name.toLowerCase().includes("season")) {
                name = name[name.length - 2] + "/" + name
            }

            final.push(
                <li onClick={this.loadFaveEvent} faveid={_faveId}  class="list-group-item text-center" name={name} title={name}>
                    {name}
                </li>
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

    videoPlaylist = document.body.querySelectorAll('[ftype="video"][value="Open"]'); // With attributes ftype and value
}

const renderFavesList = (data = null) => {
    const favesListElm = document.getElementById("faves-list");
    ReactDOM.render(
        React.createElement(FavoritesList, data),
        favesListElm
    )
}
