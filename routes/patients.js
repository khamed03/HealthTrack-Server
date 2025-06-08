import express from "express";
import {
  createPatient,
  getAllPatients,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeRoles("secretary"), createPatient);
router.get("/", authenticateToken, getAllPatients);
router.put("/:id", authenticateToken, authorizeRoles("secretary", "doctor"), updatePatient);
router.delete("/:id", authenticateToken, authorizeRoles("secretary"), deletePatient);

export default router;
