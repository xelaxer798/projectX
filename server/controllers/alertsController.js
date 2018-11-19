import db from "../models";

const controller = {

    getAlerts: function (req, res) {
        console.log("Get alerts");
        db.Alerts.findAll({
            include: [
                {
                    model: db.Sensors,
                    attribute: ['sensorName'],
                    include: [
                        {
                            model: db.Nodes,
                            attribute: ['nodeName']
                        }
                    ]

                },
                {
                    model: db.Users
                },
                {
                    all: true
                }
            ],
            order: ['alertName'],
        })
            .then(dbModel => {
                console.log("Alerts: " + JSON.stringify(dbModel));
                const resObj = dbModel.map(alert => {
                    console.log("Alert: " + JSON.stringify(alert));
                    let displaySensorName = "";
                    if(alert.Sensor) {
                        displaySensorName = alert.Sensor.Node.nodeName + "-" + alert.Sensor.sensorName;
                    }

                    return Object.assign(
                        {},
                        {
                            alertId: alert.alertId,
                            alertName: alert.alertName,
                            highValue: alert.highValue,
                            lowValue: alert.lowValue,
                            status: alert.status,
                            active: alert.active,
                            createdAt: alert.createdAt,
                            updatedAt: alert.updatedAt,
                            sensorId: alert.sensorId,
                            sensorName: displaySensorName
                        }
                    )
                });
                res.json(resObj)
            })
            .catch(err => {
                console.log("Error: " + err);
                res.status(422).json(err)
            });
    },
    createAlert: function (req, res) {
        let newRecord = req.body.alert;
        db.Alerts.create(newRecord)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    updateAlert: function (req, res){
        let updatedRecord = req.body.alert;
        db.Alerts.update(updatedRecord,
            {where:
                    {alertId: updatedRecord.alertId}
            })
            .then(dbModel => {
                console.log("Return updated alert: " + dbModel);
                res.json(dbModel);
            })
            .catch(err => {
                console.log("Error: " + err);
                res.status(422).json(err)
            })
    }
};

export {controller as default};
