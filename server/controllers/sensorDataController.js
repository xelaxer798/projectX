import db from "../models";
import functions from "../Functions";

const controller = {
    findBySensorId: function (req, res) {
        console.log("In find by sensor id: " + req.params.sensorId);
        db.SensorData.findAll({
            order: [['createdAt', 'DESC']],
            // limit: 2,
            where: {

                sensorId: req.params.sensorId

            }
        })
            .then(results => {

                try {
                    const pHx = [];
                    const pHy = [];

                    for (let i = 0; i < results.length; i++) {
                        pHx.push(functions.convertTimeZonesNonGuess(results[i].createdAt));
                        pHy.push(JSON.parse(results[i].dataValueFloat));
                    };
                    const x = pHx;
                    const y = pHy;
                    const data = [{
                        x,
                        y,
                        showlegend: false,
                        type: 'scatter',
                        mode: 'lines',
                        marker: { color: 'red' },

                    }];
                    res.json({
                        sensorId: req.params.sensorId,
                        sensorData: data, });
                } catch (err) {
                    console.log("Error: " + err);
                }
            })
            .catch(err => {
                console.log("In catch");
                res.status(422).json(err);
            });
    },
    create: function (req, res) {
        console.log("zzJSON input: " + JSON.stringify(req.body));
        db.SensorData.bulkCreate(req.body.sensorData)
            .then(dbModel => {
                console.log("DB Model: " + dbModel);
                res.json(dbModel);
            })
            .catch(err => {
                console.log("Error: " + err);
                res.status(422).json(err)
            });
        db.Nodes.update(
            {lastUpdate: new Date()},
            {where: {
                nodeId: req.body.nodeId
                }}
        )
            .then(dbModel => {
                console.log("zzJSON input update node: " + JSON.stringify(dbModel))
            })
            .catch(err => {
                console.log("Error: " + err);
                res.status(422).json(err)
            });
    },
    // create: function (req, res) {
    //     console.log("JSON input: " + req.body);
    //     db.SensorData.create({
    //         sensorId:req.body.sensorId,
    //         dataValueFloat:req.body.dataValueFloat
    //     })
    //         .then(dbModel => {
    //             console.log("DB Model: " + dbModel);
    //             res.json(dbModel);
    //         })
    //         .catch(err => {
    //             console.log("Error: " + err);
    //             res.status(422).json(err)
    //         });
    // },
};

export {controller as default};
