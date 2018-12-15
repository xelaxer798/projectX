import db from "../models";

const controller = {

    getAlertUsers: function (req, res) {
        console.log("Get alerts");
        db.AlertUsers.findAll({
            where: {
               alertId: req.params.alertId
            },
            include: [
                {
                    model: db.Users

                },
                {
                    model: db.Alerts
                }
            ],
            order: ['Users.lastName'],
        })
            .then(dbModel => res.json(dbModel))
            .catch(err => {
                console.log("Error: " + err);
                res.status(422).json(err)
            });
    },
    createAlertUsers: function (req, res) {
        let newRecord = req.body.alertUser;
        db.AlertsUsers.create(newRecord)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    updateAlertUsers: function (req, res){
        let updatedRecord = req.body.alert;
        db.AlertUsers.update(updatedRecord,
            {where:
                    {alertUsersId: updatedRecord.alertUsersId}
            })
            .then(dbModel => {
                res.json(dbModel);
            })
            .catch(err => {
                console.log("Error: " + err);
                res.status(422).json(err)
            })
    },
    updateAlertUsersLastNotification: function (lastNotification, alertUsersId) {
        db.AlertUsers.update(
            {
                lastNotification: lastNotification
            },
            {
                where: {alertUserId: alertUsersId}
            }
        )
            .then(updatedUserAlert => {
                console.log("Updated user alert: " + JSON.stringify(updatedUserAlert))
            })
            .catch(err => {
                console.log("Error: " + err);
            })

    },
    resetLastNotification: function (alertUsersId) {
        db.AlertUsers.update(
            {
                lastNotification: null
            },
            {
                where: {alertUserId: alertUsersId}
            }
        )
            .then(updatedUserAlert => {
                console.log("Updated user alert: " + JSON.stringify(updatedUserAlert))
            })
            .catch(err => {
                console.log("Error: " + err);
            })

    }

};

export {controller as default};
