import axios from 'axios';
import parser from 'xml2json';
import convert from 'xml-js';
import db from "../models";


const updateWeatherNodes = async () => {

    axios.get('https://www.wrh.noaa.gov/mesowest/getobextXml.php?sid=PU&num=700')
        .then(response => {
            console.log("Update Weather nodes response url: " + response.data.url);
            console.log("Update Weather nodes explanation: " + response.data.explanation);
            let jsonResponse = JSON.parse(parser.toJson(response.data));
            // let jsonResponse = JSON.parse(convert.xml2json(response.data, {compact: true, spaces: 4}))
            console.log("Update Weather nodes response datazz: " + JSON.stringify(jsonResponse.station));
            let convertedJson = {};
            convertedJson.nodeId = jsonResponse.station.id;
            convertedJson.sensorData = [];
            jsonResponse.station.ob.forEach((observation) => {
                let timeStamp = new Date(observation.utime*1000);
                console.log("Observation time: " + timeStamp);
                console.log("Observation utime: " + observation.utime);
                observation.variable.forEach((variable) => {
                    let sensorId = convertedJson.nodeId + "-" + variable.var
                    convertedJson.sensorData.push({
                        sensorId: sensorId,
                        dataValueFloat: variable.value,
                        createdAt: timeStamp,
                        updatedAt: timeStamp
                    })

                })
            });
            db.SensorData.bulkCreate(convertedJson.sensorData)
                .then(dbModel => {
                    console.log("DB Model: " + dbModel);

                })
                .catch(err => {
                    console.log("Error: " + err);

                });

            console.log("Update Weather nodes response data converted: " + JSON.stringify(convertedJson));
        })
        .catch(error => {
            console.log("Update Weather nodes error: " + error);
        });
};

export default updateWeatherNodes;