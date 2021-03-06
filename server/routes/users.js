import express from "express";
import users from "../controllers/usersController"

const router = express.Router();

// Route to get list of crypto currencies for drop down.
router.get("/", users.findAll);
router.get("/:id", users.findById);
router.post("/sign/in", users.signIn);
router.post("/new/user", users.create);
router.post("/reset/pass", users.ResetPassword);
router.post("/check/pass/jwt", users.authResetPass);
router.post('/auth',users.authUser);
router.put("/verification/:id",users.verification);
router.put("/change/password", users.ChangePassword);
router.delete("/:id", users.remove);


// Export routes for server.js to use.
export default router;
