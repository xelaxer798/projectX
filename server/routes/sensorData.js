import express from "express";
import sensorData from "../controllers/sensorDataController";

const router = express.Router();

// Route to get list of crypto currencies for drop down.

router.post("/create",sensorData.create)
router.get("/findBySensorId/:sensorId/:timePeriod",sensorData.findBySensorId);
router.post("/findByDateRange", sensorData.findbyDateRange)
router.get("/getGreenhouseLUX", sensorData.getGreenhouseLUX)

// Export routes for server.js to use.
export default router;
