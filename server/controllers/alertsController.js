import db from "../models";

const controller = {
    getAlerts: function(req, res) {
console.log("Get alerts");
        db.Alerts.findAll({
            order: [ [ 'alertName' ]],
        })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    createAlert: function(req, res) {
        db.Alerts.create({
            alertName:req.body.alertName,
        })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
};

export { controller as default };
