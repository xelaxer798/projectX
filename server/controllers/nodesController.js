import db from "../models";
import sgMail from '@sendgrid/mail';

const sengrido = process.env.sendgrid
sgMail.setApiKey(sengrido);

const createSensorRecords = (sensorArray) => {
     db.Sensors.bulkCreate(sensorArray,
        {
            fields: ["sensorId", "sensorName", "units","nodeId"],
            updateOnDuplicate: ["units","nodeId"]
        })
        .then(() => { // Notice: There are no arguments here, as of right now you'll have to...
            return db.Sensors.findAll();
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

    getNodesAndSensors: function (req, res) {
        console.log("Sorted nodes: ");
        db.Nodes.findAll ({
             include: [{
                model: db.Sensors,
                where: {active: true}
            }],
            order: [
                ['nodeName', 'ASC'],
                [db.Sensors, 'sensorName', 'ASC']
            ],


        })
            .then(nodes => {
                // console.log("Sorted nodes: " + JSON.stringify(nodes));
                res.json(nodes)
            })
            .catch(err => {
                console.log("Sorted nodes error: " + JSON.stringify(err));
                res.status(422).json(err)
            })
    },

    create: function (req, res) {
        console.log("JSON input node config: " + JSON.stringify(req.body));
        db.Nodes.upsert({
            nodeId: req.body.nodeId,
            nodeName: req.body.nodeName
        })
            .then(() => {
                db.Sensors.bulkCreate(req.body.sensors,
                    {
                        fields: ["sensorId", "sensorName", "units","nodeId"],
                        updateOnDuplicate: ["units","nodeId"]
                    })
                    .then((dbModel) => { // Notice: There are no arguments here, as of right now you'll have to...
                        db.Nodes.findAll({
                            where: {
                                nodeId: req.body.nodeId
                            },
                            include: [{
                                model: db.Sensors
                            }]
                        })
                            .then(dbModel => {
                                res.json(dbModel);
                            })

                    })
                res.status(200);
            })
            .catch(err => {
                console.log("Error: " + err);
                res.status(422).json(err)
            });
    },
    test: function () {
        console.log("Made it to the test");
    }
};

export {controller as default};
