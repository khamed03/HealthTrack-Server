import express from "express";
import { getDashboardCounts } from "../controllers/dashboardController.js";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/counts", authenticateToken, authorizeRoles("doctor"), getDashboardCounts);

export default router;
