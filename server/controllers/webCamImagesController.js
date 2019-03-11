import db from "../models";
import multiparty from "multiparty"
import util from "util"

const controller = {
    findAll: (req, res) => {
        db.WebCamImages.findAll({
        })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },

    findByWebCamId: function (req, res) {
        db.WebCamImages.findAll({
            where: {
                webCamId: req.params.webCamId,
            }
        })
            .then(dbModel => {
                if (dbModel) {
                    res.json(dbModel);
                } else {
                    res.status(404).json({
                        message: 'Id not found.'
                    });
                }
            })
            .catch(err => res.status(422).json(err));
    },

    uploadImage: function (req, res) {
        console.log("Webcam image upload request: " + JSON.stringify(req.body));
        // let image = new Buffer(JSON.stringify(req.body.image), 'base64');
        let form = new multiparty.Form();
        form.parse(req, function(err, fields, files) {
            console.log("Fields: " + JSON.stringify(fields));
            console.log("Files: " + JSON.stringify(files));
            let newImage = Object.assign({
                webCamId: fields.webCamId[0],
                imageType: fields.imageType[0],
                image: files.imageFile[0]
            });
            db.WebCamImages.create(newImage)
                .then(dbModel => {
                    res.writeHead(200, {'content-type': 'text/plain'});
                    res.write('received upload:\n\n');
                    res.end(util.inspect({fields: fields, files: files}));
                })
                .catch(err => res.status(422).json(err));

        });

     }
 };

export {controller as default};
