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
                return null;
            })
            .catch(err => {
                console.log("Error: " + err);
            });
        let promises = req.body.sensorData.map(function (individualSensorData) {
            console.log("Create promise: " + individualSensorData.sensorId);
            // return SensorDataAPI.getAll(selectedGraphs.sensorId);
            return db.Sensors.update(
                {currentValue: individualSensorData.dataValueFloat},
                {where: {
                        sensorId: individualSensorData.sensorId
                    }}
            )
        });

        Promise.all(promises).then(() =>{
            console.log("Uddating sensor: " + req.body.sensorId + " to " + req.body.dataValueFloat)
            return null;
        })

//         db.Sensors.update(
//             {currentValue: req.body.dataValueFloat},
//             {where: {
//                 sensorId: req.body.sensorId
//                 }}
//         )
//             .then(() =>{
//                 console.log("Uddating sensor: " + req.body.sensorId + " to " + req.body.dataValueFloat)
// return null;
//             })
//             .catch(err => {
//                 console.log("Error: " + err);
//             })
    },
    create2: function (req, res) {
        const request = req;
        db.SensorData.bulkCreate(req.body.sensorData)
            .then (() => {
                db.Nodes.update(
                    {lastUpdate: new Date()},
                    {where: {
                            nodeId: req.body.nodeId
                        }}
                )
                    .then(() => {
                        console.log("Uddating sensor: " + request.body.sensorId + " to " + request.body.dataValueFloat)
                        db.Sensors.update(
                            {currentValue: request.body.dataValueFloat},
                            {where: {
                                    sensorId: request.body.sensorId
                                }}
                        )

                    })
                    .catch(err => {
                        console.log("Error: " + err);
                        res.status(422).json(err)
                    })
            })
             .catch(err => {
                console.log("Error: " + err);
                res.status(422).json(err)
            });

    }
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
