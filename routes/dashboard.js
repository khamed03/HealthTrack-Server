const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { poolPromise } = require("../db");

// GET /api/dashboard/count
router.get("/count", auth, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ error: "Only doctors can access dashboard stats" });
  }

  try {
    const pool = await poolPromise;

    const patientCount = await pool.request().query("SELECT COUNT(*) AS total FROM Patients");
    const recordCount = await pool.request().query("SELECT COUNT(*) AS total FROM MedicalRecords");
    const appointmentCount = await pool.request().query("SELECT COUNT(*) AS total FROM Appointments");

    res.json({
      total_patients: patientCount.recordset[0].total,
      total_records: recordCount.recordset[0].total,
      total_appointments: appointmentCount.recordset[0].total
    });
  } catch (err) {
    console.error("Dashboard count error:", err);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
});

module.exports = router;
