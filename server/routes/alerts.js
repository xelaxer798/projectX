import express from "express";
import alerts from "../controllers/alertsController";

const router = express.Router();

// Route to get list of crypto currencies for drop down.

router.get("/getAll", alerts.getAlerts);
router.post("/create",alerts.createAlert);

// Export routes for server.js to use.
export default router;
