import routers from "./routes";
import express from "express";
import bodyParser from "body-parser";  // Parses incoming data
import logger from "morgan";

// Exports the app so can import anywhere (exports the default)
export default path => {
  // Create Instance of Express
  const app = express();

  // Run Morgan for Logging
  app.use(logger("dev"));
  app.use(bodyParser.json());

  app.use(express.static(`${path}/client`));
  // Where the node data will be sent aka www....../api/nodeData
  app.use("/api/nodes", routers.nodeData);
app.use("/api/users",routers.users)
  // Any non API GET routes will be directed to our React App and handled by React Router
  app.get("*", (req, res) => {
    res.sendFile(`${path}/client/index.html`);
  });

  return app; //Returns app.js
  // -------------------------------------------------
};
