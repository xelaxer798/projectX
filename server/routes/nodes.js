import express from "express";
import nodes from "../controllers/nodesController"

const router = express.Router();

// Route to get list of crypto currencies for drop down.
router.get("/:id", nodes.findById);
router.post("/config", nodes.create);

// Export routes for server.js to use.
export default router;
