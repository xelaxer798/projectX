import express from "express";
import orders from "../controllers/airtable/ordersController";
import ordersSimulations from "../controllers/airtable/ordersSimulatonsController"

const router = express.Router();

// Route to get list of crypto currencies for drop down.

router.post("/addHarvestRequests", orders.addHarvestRequests);
router.post("/addHarvestRequests2", orders.addHarvestRequests2);
router.post("/runSlotAnaylsis", ordersSimulations.runSlotAnalysis);
router.get("/getHarvestRequests", orders.getHarvestRequests);
router.get("/getHydratedOrders", orders.getHydratedOrders);
router.get("/deleteExistingRecords", orders.deleteExistingRecords);
router.get("/deleteRecordsTestBatch", orders.deleteRecordsTestBatch);
router.get("/deleteRecordsTestIndividualy", orders.deleteRecordsTestIndividualy);

// Export routes for server.js to use.
export default router;
