'use strict';

const { Storage } = require("@google-cloud/storage");
const os = require("os");
const path = require("path");
const cors = require("cors")({ origin: true });
const Busboy = require("busboy");
const fs = require("fs");

const gcconfig = {
    projectId: "prestalana-207222",
    keyFilename: "prestalana-5164b7985099.json"
};

const gcs = new Storage(gcconfig);


exports.helloWorld = (req, res) => {
    res.send('Hello World!');
};

exports.testDeploy = (req, res) => {
    res.send('Hello Test');
};

exports.uploadFile = (req, res) => {
    cors(req, res, () => {
        if (req.method !== "POST") {
            return res.status(500).json({
                message: "Not allowed"
            });
        }

        const busboy = new Busboy({ headers: req.headers });
        let uploadData = null;
        busboy.on("file", (filedname, file, filename, encoding, mimetype) => {
            const filepath = path.join(os.tmpdir(), filename);
            uploadData = {
                file: filepath,
                type: mimetype,
                folderName: req.headers.foldername,
                fileName: filename
            };
            file.pipe(fs.createWriteStream(filepath));
        });
        busboy.on("finish", () => {
            const bucket = gcs.bucket("goldenstarweb");
            bucket
                .upload(uploadData.file, {
                    destination: `${uploadData.folderName}/${uploadData.fileName}`,
                    uploadType: "media",
                    metadata: {
                        metadata: {
                            contentType: uploadData.type
                        }
                    }
                })
                .then(() => {
                    var link = "https://storage.cloud.google.com/goldenstarweb/" + uploadData.folderName + "/" + uploadData.fileName
                    res.status(200).json(link);
                })
                .catch(err => {
                    res.status(500).json({ error: err });
                });
        });
        busboy.end(req.rawBody);
    });
};