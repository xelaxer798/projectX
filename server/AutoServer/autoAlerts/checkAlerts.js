import db from '../../models';
import sgMail from "@sendgrid/mail";
import alertsUsersController from '../../controllers/alertsUsersController'
import alertsController from '../../controllers/alertsController';
import sensorsController from '../../controllers/sensorsController';
import moment from 'moment'

const sengrido = process.env.sendgrid || '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';
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
                } else if (alert.alertType === "Node") {
                    // const nodeSensorId = sensorsController.getSensorIdByNodeId(alert.nodeId);
                    // console.log("Sensor ID from node: " + nodeSensorId);
                    // sensorId = nodeSensorId;
                    includeClause = [{
                        model: db.Sensors,
                         where: {
                            nodeId: alert.nodeId
                         }
                    }]

                }
                db.SensorData.findAll({
                    where: whereClause,
                    include: includeClause,
                    limit: 1,
                    order: [['createdAt', 'DESC']]
                })
                    .then(sensorData => {
                        let currentSensorData = sensorData[0];
                        if(alert.alertType === "Sensor") {
                            let currentSensorValue = currentSensorData.dataValueFloat;
                            console.log("Sensor Dataz: " + JSON.stringify(sensorData));
                            let highValue = alert.highValue;
                            let lowValue = alert.lowValue;
                            let newStatus = "";
                            if (currentSensorValue >= lowValue && currentSensorValue <= highValue) {
                                newStatus = "a-ok"
                            } else {
                                newStatus = "danger Will Robinson"
                            }
                            alertsController.updateCurrentValueAndStatus(currentSensorValue, newStatus, alert.alertId)

                        } else if (alert.alertType === "Node") {
                            console.log("Checking node alert: " + JSON.stringify(currentSensorData));
                            let newStatus = "";
                            if (hasReportingIntervalPassed(moment(currentSensorData.createdAt), alert.nodeNonReportingTimeLimit)) {
                                newStatus = "danger Will Robinson"
                            } else {
                                newStatus = "a-ok"
                            }
                            alertsController.updateCurrentValueAndStatus(0, newStatus, alert.alertId)
                        }
                   })
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
        returnHtml += "<span style=\"color:" + color + "\"><strong>Current Value: </strong>" + alert.currentValue + "<br/></span>";

    } else if (alert.alertType === "Node") {
        returnHtml += "<strong>Node Name: </strong>" + alert.Node.nodeName + "<br/>";
        returnHtml += "<strong>Has not reported in at least: </strong>" + alert.nodeNonReportingTimeLimit + " minutes<br/>";
    }
    return returnHtml;
}

function createWarningMessage(alert, recipient) {
    console.log("createWarningMessage-Alert: " + JSON.stringify(alert));
    console.log("createWarningMessage-Recipient: " + recipient);
    return {
        to: recipient,
        from: 'LeafLiftSystems@donotreply.com',
        subject: 'Your Farm Has A Warning',
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
    const currentTime = moment(new Date());
    const difference = currentTime.diff(lastNotification, 'minutes');
    console.log("Difference: " + difference);
    console.log("Interval: " + interval);
    if (difference >= interval) {
        return true
    } else {
        return false
    }

}

export function processAlerts() {

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
                    console.log("Alert: " + JSON.stringify(alert));
                    if (alert.status === 'danger Will Robinson') {
                        if (alert.AlertUsers.lastNotification == null) {
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
