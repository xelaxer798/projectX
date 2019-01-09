import express from "express";
import sensorError from "../controllers/sensorErrorsController";

const router = express.Router();

// Route to get list of crypto currencies for drop down.

router.post("/create",sensorError.create);

// Export routes for server.js to use.
export default router;
