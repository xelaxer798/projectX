import db from "../models";
import moment from "moment";
import functions from "../Functions/index"

const controller = {

    getAlerts: function (req, res) {
        console.log("Get alerts");
        let timezone = decodeURIComponent(req.params.timezone);
        console.log("Timezone: " + timezone);
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
                console.log("Alerts returned: " + JSON.stringify(dbModel));
                const resObj = dbModel.map(alert => {
                    console.log("Alert: " + JSON.stringify(alert));
                    let displaySensorName = "";
                    if (alert.Sensor) {
                        displaySensorName = alert.Sensor.Node.nodeName + "-" + alert.Sensor.sensorName;
                    }

                    let target = "";
                    let criteria = "test";
                    let relevantInfo = "";
                    let current = "";
                    if (alert.alertType === "Sensor") {
                        target = "Sensor: " + alert.Sensor.Node.nodeName + "-" + alert.Sensor.sensorName;
                        criteria = "Above: " + alert.highValue + " or Below: " + alert.lowValue + " " + alert.Sensor.units;
                        current = "Current Value: " + alert.Sensor.currentValue + " " + alert.Sensor.units;
                    } else if (alert.alertType === "Node") {
                        target = "Node: " + alert.Node.nodeName;
                        criteria = "Not reporting in " + alert.nodeNonReportingTimeLimit + " minutes";
                        console.log("zzzNode: " + JSON.stringify(alert.Node));
                        let {_lastUpdate, elapseTimeString} = functions.getLastUpdatedAndElapseTimeStrings(timezone, alert.Node.lastUpdate);
                        console.log("Another last update: " + _lastUpdate + " " + elapseTimeString);
                        current = "Last Reported: " + _lastUpdate.format('MMM. D, YYYY [at] h:mm A z')
                            + " (" + elapseTimeString + ")"
                    } else if (alert.alertType === "Watering") {
                        target = "Watering: " + alert.Sensor.sensorName;
                        criteria = "Missed";
                    }
                    let users = ""
                    alert.Users.forEach(user => {
                        let activeSymbol = ""
                        if(user.AlertUsers.active) {
                            activeSymbol = "✅"
                        } else {
                            activeSymbol = "❌"
                        }
                        if(users == "") {
                            users = activeSymbol + user.firstName + " " + user.lastName + " (" + user.email +")"
                        } else {
                            users += ", " + activeSymbol + user.firstName + " " + user.lastName + " (" + user.email +")"
                        }
                    })

                    alert.setDataValue("sensorName", displaySensorName);
                    alert.setDataValue("target", target);
                    alert.setDataValue("criteria", criteria);
                    alert.setDataValue("current", current);
                    alert.setDataValue("users", users);

                    return alert

                    // return Object.assign(
                    //     {},
                    //     {
                    //         alertId: alert.alertId,
                    //         alertName: alert.alertName,
                    //         highValue: alert.highValue,
                    //         lowValue: alert.lowValue,
                    //         currentValue: alert.currentValue,
                    //         status: alert.status,
                    //         active: alert.active,
                    //         createdAt: alert.createdAt,
                    //         updatedAt: alert.updatedAt,
                    //         sensorId: alert.sensorId,
                    //         nodeId: alert.nodeId,
                    //         alertType: alert.alertType,
                    //         nodeNonReportingTimeLimit: alert.nodeNonReportingTimeLimit,
                    //         sensorName: displaySensorName,
                    //         target: target,
                    //         criteria: criteria,
                    //         current: current
                    //     }
                    // )
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

    updateAlert: function (req, res) {
        let updatedRecord = req.body.alert;
        db.Alerts.update(updatedRecord,
            {
                where:
                    {alertId: updatedRecord.alertId}
            })
            .then(dbModel => {
                console.log("Return updated alert: " + JSON.stringify(dbModel));
                res.json(dbModel);
            })
            .catch(err => {
                console.log("Error: " + err);
                res.status(422).json(err)
            })
    },

    updateAlertDeep: function (req, res) {
        let updatedRecord = req.body.alert;
        db.Alerts.update(updatedRecord,
            {
                where:
                    {alertId: updatedRecord.alertId}
            })
            .then(dbModel => {
                console.log("Return updated alert: " + JSON.stringify(dbModel));
                db.AlertUsers.destroy({
                    where: {
                        AlertAlertId: updatedRecord.alertId
                    }
                })
                    .then(() => {
                        let users = updatedRecord.Users;
                        let alertUsers = [];
                        if (users && users.length > 0) {
                            users.forEach(user => {
                                alertUsers.push(user.AlertUsers)
                            })
                            db.AlertUsers.bulkCreate(alertUsers)
                                .then(() => {
                                    res.json(updatedRecord)
                                })
                                .catch(err => {
                                    console.log("Error: " + err);
                                    res.status(422).json(err)
                                })
                        }
                    })
                    .catch (err => {
                        console.log("Error: " + err);
                        res.status(422).json(err)
                    })

            })
            .catch(err => {
                console.log("Error: " + err);
                res.status(422).json(err)
            })
    },

    updateCurrentValueAndStatus: function (currentSensorValue, status, alertId) {
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
