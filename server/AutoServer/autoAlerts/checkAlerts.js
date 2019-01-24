import db from '../../models';
import sgMail from "@sendgrid/mail";
import alertsUsersController from '../../controllers/alertsUsersController'
import alertsController from '../../controllers/alertsController';
import sensorsController from '../../controllers/sensorsController';
import moment from 'moment'
import functions from "../../Functions";

const sengrido = process.env.sendgrid;
console.log("Mail api key: " + sengrido);
sgMail.setApiKey(sengrido);


export function checkAlerts() {

    db.Alerts.findAll()
        .then(allAlerts => {
            console.log("Check alerts: " + JSON.stringify(allAlerts));
            allAlerts.forEach((alert) => {
                let sensorId = "";
                let whereClause = {};
                let includeClause =[];
                if(alert.alertType === "Sensor") {
                    // sensorId = alert.sensorId;
                    whereClause = {
                        sensorId: alert.sensorId
                    }

                    db.Sensors.findAll({
                        where: {sensorId: alert.sensorId}
                    })
                        .then((sensor) => {
                            console.log("Returned sensor: " + JSON.stringify(sensor))
                            console.log("Alert high value: " + alert.highValue + " low value: " + alert.lowValue)
                            let highValue = alert.highValue;
                            let lowValue = alert.lowValue;
                            let newStatus = "";
                            if (sensor[0].currentValue >= lowValue && sensor[0].currentValue <= highValue) {
                                console.log("set ot a-ok");
                                newStatus = "a-ok"
                            } else {
                                console.log("set to danger");
                                newStatus = "danger Will Robinson"
                            }
                            alertsController.updateCurrentValueAndStatus(sensor.currentValue, newStatus, alert.alertId)

                        })
                    return null;
                } else if (alert.alertType === "Node") {

                    db.Nodes.findAll({
                        where: {nodeId: alert.nodeId}
                    })
                        .then((node) => {
                            console.log("Checking node alert: " + JSON.stringify(node));
                            let newStatus = "";
                            if (hasReportingIntervalPassed(moment(node[0].lastUpdate), alert.nodeNonReportingTimeLimit)) {
                                newStatus = "danger Will Robinson"
                            } else {
                                newStatus = "a-ok"
                            }
                            alertsController.updateCurrentValueAndStatus(0, newStatus, alert.alertId)

                        })
                    return null
                    // const nodeSensorId = sensorsController.getSensorIdByNodeId(alert.nodeId);
                    // console.log("Sensor ID from node: " + nodeSensorId);
                    // sensorId = nodeSensorId;
                    // includeClause = [{
                    //     model: db.Sensors,
                    //      where: {
                    //         nodeId: alert.nodeId
                    //      }
                    // }]

                }


                // db.SensorData.findAll({
                //     where: whereClause,
                //     include: includeClause,
                //     limit: 1,
                //     order: [['createdAt', 'DESC']]
                // })
                //     .then(sensorData => {
                //         let currentSensorData = sensorData[0];
                //         if(alert.alertType === "Sensor") {
                //             let currentSensorValue = currentSensorData.dataValueFloat;
                //             console.log("Sensor Dataz: " + JSON.stringify(sensorData));
                //             let highValue = alert.highValue;
                //             let lowValue = alert.lowValue;
                //             let newStatus = "";
                //             if (currentSensorValue >= lowValue && currentSensorValue <= highValue) {
                //                 newStatus = "a-ok"
                //             } else {
                //                 newStatus = "danger Will Robinson"
                //             }
                //             alertsController.updateCurrentValueAndStatus(currentSensorValue, newStatus, alert.alertId)
                //
                //         } else if (alert.alertType === "Node") {
                //             console.log("Checking node alert: " + JSON.stringify(currentSensorData));
                //             let newStatus = "";
                //             if (hasReportingIntervalPassed(moment(currentSensorData.createdAt), alert.nodeNonReportingTimeLimit)) {
                //                 newStatus = "danger Will Robinson"
                //             } else {
                //                 newStatus = "a-ok"
                //             }
                //             alertsController.updateCurrentValueAndStatus(0, newStatus, alert.alertId)
                //         }
                //    })
            })
        })


};

function createSensorWarningHTML(alert, color) {
    let returnHtml = "";
    if(alert.alertType === "Sensor") {
        returnHtml += "<strong>Node Name: </strong>" + alert.Sensor.Node.nodeName + "<br/>";
        returnHtml += "<strong>Sensor Name: </strong>" + alert.Sensor.sensorName + "<br/>";
        returnHtml += "<strong>High limit: </strong>" + alert.highValue + "<br/>";
        returnHtml += "<strong>Low Limit: </strong>" + alert.lowValue + "<br/>";
        returnHtml += "<span style=\"color:" + color + "\"><strong>Current Value: </strong>" + alert.Sensor.currentValue + "<br/></span>";

    } else if (alert.alertType === "Node") {
        returnHtml += "<strong>Node Name: </strong>" + alert.Node.nodeName + "<br/>";
        returnHtml += "<strong>Has not reported in at least: </strong>" + alert.nodeNonReportingTimeLimit + " minutes<br/>";
        let {_lastUpdate, elapseTimeString} = functions.getLastUpdatedAndElapseTimeStrings("America/Los_Angeles", alert.Node.lastUpdate);
        returnHtml += "<strong>Last Reported: </strong>" + _lastUpdate.format('MMM. D, YYYY [at] h:mm A z')
            + " (" + elapseTimeString +   ")"

    }
    return returnHtml;
}

function createSensorWarningSubject(alert) {
    let warning = "";
    if(alert.alertType === "Sensor") {
        warning += alert.Sensor.Node.nodeName + " " + alert.Sensor.sensorName + ": " + alert.Sensor.currentValue;

    } else if (alert.alertType === "Node") {
        let {_lastUpdate, elapseTimeString} = functions.getLastUpdatedAndElapseTimeStrings("America/Los_Angeles", alert.Node.lastUpdate);
        warning +=  alert.Node.nodeName + " Last Reported: " + _lastUpdate.format('MMM. D, YYYY [at] h:mm A z');
     }
    return warning;
}

function createWarningMessage(alert, recipient) {
    console.log("createWarningMessage-Alert: " + JSON.stringify(alert));
    console.log("createWarningMessage-Recipient: " + recipient);
    return {
        to: recipient,
        from: 'LeafLiftSystems@donotreply.com',
        subject: "test",
        text: 'Click me ',
        html: createSensorWarningHTML(alert, "red")
    }
}

function createBackToNormalMessage(alert, recipient) {
    console.log("createWarningMessage-Alert: " + JSON.stringify(alert));
    console.log("createWarningMessage-Recipient: " + recipient);
    return {
        to: recipient,
        from: 'LeafLiftSystems@donotreply.com',
        subject: 'Things are back to normal',
        text: 'Click me ',
        html: createSensorWarningHTML(alert, "green")
    }
}
function hasReportingIntervalPassed(lastNotification, interval) {
    console.log("Last notification:  " + lastNotification.format('MMM. D, YYYY [at] h:mm A z'));
    const currentTime = moment(new Date());
    const duration = moment.duration(currentTime.diff(lastNotification));
    const difference = duration.asMinutes();
    console.log("Current Time: " + currentTime.format('MMM. D, YYYY [at] h:mm A z'));
    console.log("Last notification:  " + lastNotification.format('MMM. D, YYYY [at] h:mm A z'));
    console.log("Difference: " + difference);
    console.log("Interval: " + interval);
    if (difference >= interval) {
        return true
    } else {
        return false
    }

}

export function processAlerts() {
    console.log("Processing alerts");

    db.Users.findAll({
        include: [
            {
                model: db.Alerts,
                include: [
                    {
                        model: db.Sensors,
                        include: [
                            {
                                model: db.Nodes
                            }
                        ]
                    },
                    {
                        model: db.Nodes
                    }
                ]

            }]
    })
        .then(allUsers => {
            console.log("Alert Users Data: " + JSON.stringify(allUsers));
            allUsers.forEach((user) => {
                user.Alerts.forEach((alert) => {
                    console.log("Processing Alert for user: " + user.email + " Alerts: " + JSON.stringify(alert));
                    if (alert.status === 'danger Will Robinson') {
                        console.log("We have a problem: " + JSON.stringify(alert));
                        if (alert.AlertUsers.lastNotification === null) {
                            console.log("First time notification");
                            sgMail.send(createWarningMessage(alert, user.email));
                            alertsUsersController.updateAlertUsersLastNotification(new Date(), alert.AlertUsers.alertUserId);
                        } else if (hasReportingIntervalPassed(moment(alert.AlertUsers.lastNotification),alert.AlertUsers.notificationInterval)) {
                            console.log("recurring notification");
                            sgMail.send(createWarningMessage(alert, user.email));
                            alertsUsersController.updateAlertUsersLastNotification(new Date(), alert.AlertUsers.alertUserId);
                        }

                    } else if (alert.status === 'a-ok' && alert.AlertUsers.lastNotification != null) {
                        console.log("Things back to normal");
                        sgMail.send(createBackToNormalMessage(alert, user.email));
                        alertsUsersController.resetLastNotification(alert.AlertUsers.alertUserId);

                    }
                })
            })

        })
        .catch(err => {
            console.log("Error: " + err);
        })

};
