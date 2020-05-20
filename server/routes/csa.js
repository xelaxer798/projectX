import express from "express";
import csa from "../controllers/csaController";

const router = express.Router();

// Route to get list of crypto currencies for drop down.

router.post("/handleCSAsignup", csa.handleSignUp);

// Export routes for server.js to use.
export default router;
