import express from "express";
import sensors from "../controllers/sensorsController"

const router = express.Router();

// Route to get list of crypto currencies for drop down.
router.get("/getSensors", sensors.getSensors);

// Export routes for server.js to use.
export default router;
