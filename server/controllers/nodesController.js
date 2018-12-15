import db from "../models";
import sgMail from '@sendgrid/mail';

const sengrido = process.env.sendgrid
sgMail.setApiKey(sengrido);

const createSensorRecords = (sensorArray) => {
    db.Sensors.bulkCreate(sensorArray,
        {
            fields: ["sensorId", "sensorName", "units","nodeId"],
            updateOnDuplicate: ["sensorName", "units","nodeId"]
        })
        .then(() => { // Notice: There are no arguments here, as of right now you'll have to...
            return db.Sensors.findAll();
        }).then(sensors => {
        console.log("Sensors: " + sensors) // ... in order to get the array of user objects
    })

};

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
    getNodes: function (req, res) {
        console.log("Get nodes");
        db.Nodes.findAll({

        })
            .then(dbModel => {
                res.json(dbModel);
            })
            .catch(err => {
                res.status(422).json(err);
            });
    },

    create: function (req, res) {
        console.log("JSON input: " + req.body);
        db.Nodes.upsert({
            nodeId: req.body.nodeId,
            nodeName: req.body.nodeName
        })
            .then(dbModel => {
                console.log("DB Model: " + dbModel);
                res.json(dbModel);
                createSensorRecords(req.body.sensors)
            })
            .catch(err => {
                console.log("Error: " + err);
                res.status(422).json(err)
            });
    },
};

export {controller as default};
