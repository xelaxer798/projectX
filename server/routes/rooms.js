import express from "express";
import rooms from "../controllers/roomsController";

const router = express.Router();

// Route to get list of crypto currencies for drop down.

router.get("/the/rooms", rooms.getRooms);
router.post("/create/rooms",rooms.create)

// Export routes for server.js to use.
export default router;
