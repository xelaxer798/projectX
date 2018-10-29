import db from "../models";

const controller = {
    getSensors: function(req, res) {

        db.Sensors.findAll({
            include: [
                {
                    model: db.Nodes
                }
            ]
        })
            .then(dbModel => {
                console.log(JSON.stringify(dbModel));
                res.json(dbModel);
            })
            .catch(err => res.status(422).json(err));
    }
};

export { controller as default };
