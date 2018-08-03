import express from "express";
import nodeData from "../controllers/nodeDataController"

const router = express.Router();

// Route to get list of crypto currencies for drop down.
router.get("/:id", nodeData.findAll);
router.get("/the/room/:id", nodeData.findById);
router.post("/rooms/", nodeData.create);
router.put("/:id", nodeData.update);
router.delete("/", nodeData.remove);
router.delete("/die/:id", nodeData.removeOne);

// Export routes for server.js to use.
export default router;
