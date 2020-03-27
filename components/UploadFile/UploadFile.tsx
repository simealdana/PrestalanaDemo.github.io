declare var require: any

var React = require('react');
var axios = require('axios');


class UploadFile extends React.Component {
    handleUpload = e => {
        e.preventDefault();
        e.target.files[0];

        const fd = new FormData();
        fd.append("image", e.target.files[0], e.target.files[0].name);

        axios
            .post(
                "https://us-central1-prestalana-207222.cloudfunctions.net/uploadFile",
                fd,
                { headers: { folderName: "animailes/perros" } }
            )
            .then(result => {
                console.log(result.data.downloadURL); 
            })
            .catch(err => console.log(err));
    };

    render() {
        return (
            <div >
                <input type="file" onChange={this.handleUpload} />
            </div>
        );
    }
}

export default UploadFile;