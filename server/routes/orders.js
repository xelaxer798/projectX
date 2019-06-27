import express from "express";
import orders from "../controllers/airtable/ordersController";

const router = express.Router();

// Route to get list of crypto currencies for drop down.

router.post("/addHarvestRequests", orders.addHarvestRequests);
router.get("/getHarvestRequests", orders.getHarvestRequests);
router.get("/getHydratedOrders", orders.getHydratedOrders);
router.get("/deleteExistingRecords", orders.deleteExistingRecords);
router.get("/deleteRecordsTestBatch", orders.deleteRecordsTestBatch);
router.get("/deleteRecordsTestIndividualy", orders.deleteRecordsTestIndividualy);

// Export routes for server.js to use.
export default router;
