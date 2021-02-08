// Create a ES6 class component
class FilesList extends React.Component {
    // Use the render function to return JSX component
    render() {
        let final = [];
        let files = this.props.files;

        for (let file of files) {
            final.push(
                <div class="col-sm-12 col-md-6 col-lg-4">
                    <div class="card">
                        <div class="card-header">{file}</div>
                        <div class="card-body">
                            <img class="image-style" src="/api/files/file" alt="{file}" />
                        </div>
                        <div class="card-footer">
                            <input app="{file}" class="btn btn-secondary btn-sm" type="button" value="Launch"/>
                            <input app="{file}" class="btn btn-secondary btn-sm" type="button" value="Launch Locally"/>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div class="row">
                {final}
            </div>
        );
    }
}

const renderFilesList = (data = null) => {
    // Obtain the root
    const filesListElm = document.getElementById('files')
    console.log(data);

    // // Use the ReactDOM.render to show our component on the browser
    // ReactDOM.render(
    //     React.createElement(FilesList, data),
    //     filesListElm
    // )
}
