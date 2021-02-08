const setFileIconType = (fileName) => {
    let icoPath = "";

    if (fileName.match(/\.(doc|docx|xls|xlsx|rtf)\b/) != null) {
        icoPath = "static/imgs/icons/doc.png";
    } else if (fileName.match(/\.(7z|7zip|zip|tar.gz|tar.xz|gz|rar|jar)\b/) != null) {
        icoPath = "resources/images/icons/arc.png";
    } else if (fileName.match(/\.(pdf)\b/) != null) {
        icoPath = "static/imgs/icons/pdf.png";
    } else if (fileName.match(/\.(html)\b/) != null) {
        icoPath = "static/imgs/icons/html.png";
    } else if (fileName.match(/\.(txt|conf)\b/) != null) {
        icoPath = "static/imgs/icons/text.png";
    } else if (fileName.match(/\.(iso|img)\b/) != null) {
        icoPath = "static/imgs/icons/img.png";
    } else if (fileName.match(/\.(sh|batch|exe)\b/) != null) {
        icoPath = "static/imgs/icons/scrip.png";
    } else {
        icoPath = "static/imgs/icons/bin.png";
    }

    return icoPath
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
            final.push(
                <div class="col-sm-12 col-md-6 col-lg-4">
                    <div class="card">
                        <div class="card-header">
                            <img class="icon-style" src={ setFileIconType(file[0]) } alt={file[0]} />
                            {file[0]}
                        </div>
                        <div class="card-body">
                        <img class="image-style" src={"api/file-manager-action/" + file[1]} alt={file[0]} />
                        </div>
                        <div class="card-footer">
                            <input app={file[1]} onClick={this.openThisLocally} class="btn btn-secondary btn-sm float-left" type="button" value="Open Locally"/>
                            <input app={file[1]} onClick={this.openThis} class="btn btn-secondary btn-sm float-right" type="button" value="Open"/>
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
