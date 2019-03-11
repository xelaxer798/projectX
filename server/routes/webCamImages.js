import express from "express";
import webCamController from "../controllers/webCamImagesController"

const router = express.Router();

// Route to get list of crypto currencies for drop down.
router.get("/", webCamController.findAll);
router.get("/:webCamId", webCamController.findByWebCamId);
router.post("/uploadImage", webCamController.uploadImage);


// Export routes for server.js to use.
export default router;
