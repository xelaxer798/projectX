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
                    model: db.Nodes
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

                    let target = "";
                    let criteria = "test";
                    let relevantInfo = "";
                    if(alert.alertType === "Sensor") {
                        target = "Sensor: " + alert.Sensor.Node.nodeName + "-" + alert.Sensor.sensorName;
                        criteria = "Above: " + alert.highValue + " or Below: " + alert.lowValue;
                    } else {
                        target = "Node: " + alert.Node.nodeName;
                        criteria = "Not reporting in " + alert.nodeNonReportingTimeLimit + " minutes";
                    }

                    return Object.assign(
                        {},
                        {
                            alertId: alert.alertId,
                            alertName: alert.alertName,
                            highValue: alert.highValue,
                            lowValue: alert.lowValue,
                            currentValue: alert.currentValue,
                            status: alert.status,
                            active: alert.active,
                            createdAt: alert.createdAt,
                            updatedAt: alert.updatedAt,
                            sensorId: alert.sensorId,
                            nodeId: alert.nodeId,
                            alertType: alert.alertType,
                            nodeNonReportingTimeLimit: alert.nodeNonReportingTimeLimit,
                            sensorName: displaySensorName,
                            target: target,
                            criteria: criteria
                        }
                    )
                });
                console.log("ResObj: " + JSON.stringify(resObj));
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
    },

    updateCurrentValueAndStatus: function(currentSensorValue, status, alertId) {
        db.Alerts.update(
            {
                currentValue: currentSensorValue,
                status: status

            },
            {
                where: {alertId: alertId}
            })
            .then(updatedAlert => {
                console.log("Updated alert: " + JSON.stringify(updatedAlert))
            })
            .catch(err => {
                console.log("Error: " + err);
            })

    }
};

export {controller as default};
