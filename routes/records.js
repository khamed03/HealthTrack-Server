import express from "express";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
} from "../controllers/medicalRecordController.js";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeRoles("doctor"), createRecord);
router.get("/", authenticateToken, getAllRecords);
router.put("/:id", authenticateToken, authorizeRoles("doctor"), updateRecord);
router.delete("/:id", authenticateToken, authorizeRoles("doctor"), deleteRecord);

export default router;
