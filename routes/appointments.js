import express from "express";
import {
  createAppointment,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentsController.js";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeRoles("secretary"), createAppointment);
router.get("/", authenticateToken, getAllAppointments);
router.put("/:id", authenticateToken, authorizeRoles("secretary"), updateAppointment);
router.delete("/:id", authenticateToken, authorizeRoles("secretary"), deleteAppointment);

export default router;
