import express from "express";
import warningsData from "../controllers/warningsController"

const router = express.Router();

// Route to get list of crypto currencies for drop down.

router.get("/:id", warningsData.warnings);

router.delete("/delete/:userid", warningsData.removeWarning);
// Export routes for server.js to use.
export default router;
