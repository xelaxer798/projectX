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
  // autoServer.checkNodes(10);
  //1800000
  //30000
  //Start the autoserver.checkNodes to see if the nodes are offline 
  autoServer.checkNodes();
  // Start the interval of the autoserver.checkNodes to see if nodes haven't reported in last 30 minutes
  setInterval(autoServer.checkNodes,1800000);

  app.use(express.static(`${path}/client`));

  // Where the node data will be sent aka www....../api/nodeData
  app.use("/api/nodes", routers.nodeData);
  app.use("/api/warnings", routers.warnings);
  app.use("/api/users",routers.users);
  app.use("/api/rooms",routers.rooms);
  // Any non API GET routes will be directed to our React App and handled by React Router
  app.get("*", (req, res) => {
    res.sendFile(`${path}/client/index.html`);
  });

  return app; //Returns app.js
  // -------------------------------------------------
};
