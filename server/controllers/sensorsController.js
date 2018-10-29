import db from "../models";

const controller = {
    getSensors: function(req, res) {

        db.Sensors.findAll({
             include: [
                {
                    model: db.Nodes,
                    attributes: ['nodeName']
                }
            ]
        })
            .then(dbModel => {
                console.log("Model: " + JSON.stringify(dbModel));
                const resObj = dbModel.map(sensor => {
                    return Object.assign(
                        {},
                        {
                            sensorId: sensor.sensorId,
                            sensorName: sensor.sensorName,
                            units: sensor.units,
                            nodeName: sensor.Node.nodeName,
                            dropdownLabel: sensor.Node.nodeName + "-" + sensor.sensorName
                        }
                    )
                });
                console.log("Model new: " + JSON.stringify(resObj));
                res.json(resObj);
            })
            .catch(err => {
                console.log("Error " + err);
                res.status(422).json(err);
            });
    }
};

export { controller as default };
