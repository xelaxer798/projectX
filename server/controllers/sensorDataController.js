import db from "../models";
import functions from "../Functions";
import moment from 'moment';
import {Op} from 'sequelize'

const processResults = (results, res, req, sensorId) => {

    try {
        const pHx = [];
        const pHy = [];
        let plotType, plotMode, barMode;
        if (sensorId.includes("Flow")) {
            plotType = "bar";
            plotMode = "";
            barMode = "group"
        } else {
            plotType = "scatter";
            plotMode = "lines";
            barMode = "";
        }

        for (let i = 0; i < results.length; i++) {
            pHx.push(functions.convertTimeZonesNonGuess(results[i].createdAt));
            pHy.push(JSON.parse(results[i].dataValueFloat));
        }
        ;
        const x = pHx;
        const y = pHy;
        const data = [{
            x,
            y,
            showlegend: false,
            type: plotType,
            mode: plotMode,
            barMode: barMode,
            marker: {color: 'red'},

        }];
        res.json({
            sensorId: sensorId,
            sensorData: data,
        });
    } catch (err) {
        console.log("Error: " + err);
    }
}

const controller = {
    findBySensorId: function (req, res) {
        console.log("In find by sensor id: " + req.params.sensorId);
        let oneDayAgo = moment().subtract(req.params.timePeriod, 'hours');
        db.SensorData.findAll({
            order: [['createdAt', 'DESC']],
            // limit: 2,
            where: {

                sensorId: req.params.sensorId,
                createdAt: {[Op.gte]: oneDayAgo}

            }
        })
            .then(results => {
                    processResults(results, res, req, req.params.sensorId)
                }

                //     results => {
                //
                //     try {
                //         const pHx = [];
                //         const pHy = [];
                //
                //         for (let i = 0; i < results.length; i++) {
                //             pHx.push(functions.convertTimeZonesNonGuess(results[i].createdAt));
                //             pHy.push(JSON.parse(results[i].dataValueFloat));
                //         };
                //         const x = pHx;
                //         const y = pHy;
                //         const data = [{
                //             x,
                //             y,
                //             showlegend: false,
                //             type: 'scatter',
                //             mode: 'lines',
                //             marker: { color: 'red' },
                //
                //         }];
                //         res.json({
                //             sensorId: req.params.sensorId,
                //             sensorData: data, });
                //     } catch (err) {
                //         console.log("Error: " + err);
                //     }
                // }
            )
            .catch(err => {
                console.log("Error in find by sensor id: " + JSON.stringify(err));
                res.status(422).json(err);
            });
    },

    findbyDateRange: function (req, res) {
        console.log("In find by date range id: " + JSON.stringify(req.body));
        db.SensorData.findAll({
            order: [['createdAt', 'DESC']],
            // limit: 2,
            where: {
                sensorId: req.body.id,
                createdAt: {[Op.between]: [req.body.startDate, req.body.endDate]}
            }
        })
            .then(results => {
                processResults(results, res, req, req.body.id)
            })

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
            {
                where: {
                    nodeId: req.body.nodeId
                }
            }
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
                {
                    where: {
                        sensorId: individualSensorData.sensorId
                    }
                }
            )
        });

        Promise.all(promises).then(() => {
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

    getWaterings: function (req, res) {
        console.log("In getWaterings");
        let whereClause;
        if (req.body.id) {
            console.log("Get Waterings by id: " + req.body.id + "\tStart date: " + req.body.startDate+ "\tEnd date: " + req.body.endDate);
            whereClause = {
                sensorId:req.body.id,
                createdAt: {[Op.between]: [req.body.startDate, req.body.endDate]}
            }
        } else {
            whereClause = {
                sensorId: {
                    [Op.like]: "%FlowEvent%"
                },
            }
        }
        db.SensorData.findAll({
            order: [['createdAt', 'DESC']],
            where: whereClause,
            include: [
                {
                    model: db.Sensors,
                    attribute: ['sensorName'],
                },
            ],

        })
            .then(results => {
                const resObj = results.map(watering => {
                    let startTime = moment(watering.createdAt);
                    let endTime = moment(watering.endTime);
                    let duration = moment(endTime - startTime);
                    let durationSeconds = moment.duration(endTime.diff(startTime)).asSeconds();
                    console.log("Duration in seconds: " + durationSeconds)
                    console.log("Watering: " + JSON.stringify(watering));
                    return Object.assign(
                        {},
                        {
                            sensorId: watering.sensorId,
                            sensorName: watering.Sensor.sensorName,
                            amount: watering.dataValueFloat,
                            startTime: startTime,
                            endTime: endTime,
                            duration: duration,
                            updatedAt: watering.updatedAt,
                            rate: watering.dataValueFloat / durationSeconds
                        }
                    )
                });

                console.log("ResObj: " + JSON.stringify(resObj));
                res.json(resObj)
            })
            .catch(err => {
                console.log("Error: " + err);
            });

    },

    getWateringsByDate: function (cutOffDate, sensorId) {
        console.log("Get Waterings by date: " + cutOffDate)
        let returnData = db.SensorData.findAll({
            order: [['createdAt', 'DESC']],
            where: {
                sensorId: sensorId,
                updatedAt: {
                    [Op.gte]: cutOffDate
                }
            },
            include: [
                {
                    model: db.Sensors,
                    attribute: ['sensorName'],
                },
            ],

        })
            .then(results => {
                const resObj = results.map(watering => {
                    let startTime = moment(watering.createdAt);
                    let endTime = moment(watering.endTime);
                    let duration = moment(endTime - startTime);
                    let durationSeconds = moment.duration(endTime.diff(startTime)).asSeconds();
                    console.log("Duration in seconds: " + durationSeconds)
                    console.log(JSON.stringify(watering));
                    return Object.assign(
                        {},
                        {
                            sensorId: watering.sensorId,
                            sensorName: watering.Sensor.sensorName,
                            amount: watering.dataValueFloat,
                            startTime: startTime,
                            endTime: endTime,
                            duration: duration,
                            updatedAt: watering.updatedAt,
                            rate: watering.dataValueFloat / durationSeconds
                        }
                    )
                });

                console.log("Watering ResObj: " + JSON.stringify(resObj));
                return resObj

            })
            .catch(err => {
                console.log("Error getWateringsByDate: " + err);
            })
        return returnData;
    },

    getGreenhouseLUX: function (req, res) {
        console.log("In getGreenhouseLUX");
        db.SensorData.findAll({
            order: [['createdAt', 'DESC']],
            limit: 1,
            where: {
                sensorId: "7C0AF8A4AE30-LUX1",
            }
        })
            .then(results => {
                res.json({
                    lux: results[0].dataValueFloat
                });

            })
            .catch(err => {
                console.log("Error: " + err);
            });

    },
    create2: function (req, res) {
        const request = req;
        db.SensorData.bulkCreate(req.body.sensorData)
            .then(() => {
                db.Nodes.update(
                    {lastUpdate: new Date()},
                    {
                        where: {
                            nodeId: req.body.nodeId
                        }
                    }
                )
                    .then(() => {
                        console.log("Uddating sensor: " + request.body.sensorId + " to " + request.body.dataValueFloat)
                        db.Sensors.update(
                            {currentValue: request.body.dataValueFloat},
                            {
                                where: {
                                    sensorId: request.body.sensorId
                                }
                            }
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
