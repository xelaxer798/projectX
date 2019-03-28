import routers from "./routes";
import express from "express";
import bodyParser from "body-parser";  // Parses incoming data
import logger from "morgan";
import autoServer from './AutoServer/index';

// Exports the app so can import anywhere (exports the default)
export default path => {
    // Create Instance of Express
    const app = express();
    // Run Morgan for Logging

    app.use(logger("dev"));

    app.use(bodyParser.json());
    // var rawBodyParser = bodyParser.raw();

    // autoServer.checkNodes(10);
    //1800000
    //30000
    //Start the autoserver.checkNodes to cache the last recored time. so that next time it can compare to see if it has updated.
    // autoServer.checkNodes();
    // Start the interval of the autoserver.checkNodes to see if nodes haven't reported in last 30 minutes
    // setInterval(autoServer.checkNodes, 1800000);

    autoServer.autoAlerts.checkAlerts();
    setInterval(autoServer.autoAlerts.checkAlerts, 1000 * 60);

    autoServer.autoAlerts.processAlerts();
    setInterval(autoServer.autoAlerts.processAlerts, 1000 * 60);

    // autoServer.updateWeatherNodes();
    // setInterval(autoServer.updateWeatherNodes, 1000 * 60);

    app.use(express.static(`${path}/client`));

    // Where the node data will be sent aka www....../api/nodeData
    app.use("/api/nodes", routers.nodes);
    app.use("/api/warnings", routers.warnings);
    app.use("/api/users", routers.users);
    app.use("/api/rooms", routers.rooms);
    app.use("/api/sensorData", routers.sensorData);
    app.use("/api/sensors", routers.sensors);
    app.use("/api/alerts", routers.alerts);
    app.use("/api/sensorErrors", routers.sensorErrors);
    app.use("/api/webCamImages", routers.webCamImages);
    app.use("/api/crops", routers.crops);
    // Any non API GET routes will be directed to our React App and handled by React Router
    app.get("*", (req, res) => {
        res.sendFile(`${path}/client/index.html`);
    });

    return app; //Returns app.js
    // -------------------------------------------------
};
