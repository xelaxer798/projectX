import db from "../models";

const controller = {
    getSensors: function(req, res) {

        db.Sensors.findAll({
        })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    }
};

export { controller as default };
