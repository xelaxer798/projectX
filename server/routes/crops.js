import express from "express";
import crops from "../controllers/airtable/cropsController";

const router = express.Router();

// Route to get list of crypto currencies for drop down.

router.get("/getCrops", crops.getCrops);
router.post("/getPlantings", crops.getPlantings);

// Export routes for server.js to use.
export default router;
