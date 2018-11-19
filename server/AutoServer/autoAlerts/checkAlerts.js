import db from '../../models';


export function checkAlerts ()  {

    db.Alerts.findAll()
        .then(allAlerts => {
            console.log("Check alerts: " + JSON.stringify(allAlerts));
            allAlerts.forEach((alert) => {
                db.SensorData.findAll({
                    where: {
                        sensorId: alert.sensorId
                    },
                    limit: 1,
                    order: [['createdAt', 'DESC']]
                })
                    .then(sensorData => {
                        let currentSensorData = sensorData[0];
                        let currentSensorValue = currentSensorData.dataValueFloat;
                        console.log("Sensor Data: " + JSON.stringify(sensorData));
                        let highValue = alert.highValue;
                        let lowValue = alert.lowValue;
                        let newStatus = "";
                        if (currentSensorValue >=lowValue && currentSensorValue <= highValue) {
                            newStatus = "a-ok"
                        } else {
                            newStatus = "danger Will Robinson"
                        }
                        if (newStatus !== alert.status) {
                            console.log("status change");
                            // let alertToUpdate = Object.assign(alert);
                            // alertToUpdate.status = newStatus;
                            console.log("updated alert" + JSON.stringify(alert));
                            console.log("Alert ID: " + alert.alertId);

                             db.Alerts.update(
                                 {status: newStatus},
                                {
                                    where: {alertId: alert.alertId}
                                })
                                .then (updatedAlert => {
                                    console.log("Updated alert: " + JSON.stringify(updatedAlert))
                                })
                                .catch(err => {
                                    console.log("Error: " + err);
                                })
                        }
                    })
            })
        })


};

export function processAlerts()  {

    db.Users.findAll({
        include: [
            {
                model: db.Alerts

            }]
        //     {
        //         model: db.Users
        //     }
        // ]
    })
        .then(allUsers => {
            console.log("Alert Users Data: " + JSON.stringify(allUsers));
            allUsers.forEach((user) => {
                user.Alerts.forEach((alert) => {
                    console.log("Alert: " + JSON.stringify(alert));
                })
            })

        })
        .catch(err => {
            console.log("Error: " + err);
        })

};
