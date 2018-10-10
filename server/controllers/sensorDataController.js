import db from "../models";
import sgMail from '@sendgrid/mail';


const controller = {
    findById: function (req, res) {

        db.Nodes.findAll({
            order: [['createdAt', 'DESC']],
            limit: 25,
            where: {

                userId: req.params.id

            }
        })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    create: function (req, res) {
        console.log("JSON input: " + req.body);
        db.SensorData.bulkCreate(req.body.sensorData)
            .then(dbModel => {
                console.log("DB Model: " + dbModel);
                res.json(dbModel);
            })
            .catch(err => {
                console.log("Error: " + err);
                res.status(422).json(err)
            });
    },
    // create: function (req, res) {
    //     console.log("JSON input: " + req.body);
    //     db.SensorData.create({
    //         sensorId:req.body.sensorId,
    //         dataValueFloat:req.body.dataValueFloat
    //     })
    //         .then(dbModel => {
    //             console.log("DB Model: " + dbModel);
    //             res.json(dbModel);
    //         })
    //         .catch(err => {
    //             console.log("Error: " + err);
    //             res.status(422).json(err)
    //         });
    // },
};

export {controller as default};
