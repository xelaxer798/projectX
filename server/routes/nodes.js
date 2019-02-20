import express from "express";
import nodes from "../controllers/nodesController"
import updateWeatherNodes from "../AutoServer/updateWeatherNodes"

const router = express.Router();

// Route to get list of crypto currencies for drop down.
router.get("/:id", nodes.findById);
router.get("/config/getNodes", nodes.getNodes)
router.post("/config", nodes.create);
router.get("/config/updateWeatherNodes", updateWeatherNodes)

// Export routes for server.js to use.
export default router;
