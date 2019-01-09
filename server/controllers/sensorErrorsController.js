import db from "../models";

const controller = {
    create: function (req, res) {
        console.log("zzJSON input: " + JSON.stringify(req.body));
        db.SensorErrors.bulkCreate(req.body.sensorErrors)
            .then(dbModel => {
                console.log("DB Model: " + dbModel);
                res.json(dbModel);
            })
            .catch(err => {
                console.log("Error: " + err);
                res.status(422).json(err)
            });

    },
};

export {controller as default};
