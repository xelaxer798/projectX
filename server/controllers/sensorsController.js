import db from "../models";

const controller = {
    getSensors: function (req, res) {
console.log("In getSensors on the back end")
        db.Sensors.findAll({
            where: {active: true},
            include: [
                {
                    model: db.Nodes,
                    attributes: ['nodeName']
                }
            ],
            order: [
                [db.Nodes, 'nodeName', 'ASC'],
                ['sensorName', 'ASC']
            ]
        })
            .then(dbModel => {
                console.log("Get all sensors: " + dbModel);
                const resObj = dbModel.map(sensor => {
                    return Object.assign(
                        {},
                        {
                            sensorId: sensor.sensorId,
                            sensorName: sensor.sensorName,
                            units: sensor.units,
                            nodeName: sensor.Node.nodeName,
                            dropdownLabel: sensor.Node.nodeName + " - " + sensor.sensorName
                        }
                    )
                });
                console.log("getAllSensors: " + JSON.stringify(resObj))
                res.json(resObj);
            })
            .catch(err => {
                console.log("Get sensors error: " + err);
                res.status(422).json(err);
            });
    },

    getSensorIdByNodeId: function (nodeId) {
        console.log("Node ID: " + nodeId);
        db.Sensors.findAll({
            where: {
                nodeId: nodeId
            },
            limit: 1
        })
            .then(sensors => {
                console.log("Return sensor: " + sensors[0].sensorId);
                return sensors[0].sensorId
            })
    }
};

export {controller as default};
