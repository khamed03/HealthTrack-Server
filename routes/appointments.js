const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");
const auth = require("../middleware/authMiddleware");

// 🔍 GET all appointments (Doctor + Secretary)
router.get("/", auth, async (req, res) => {
  if (req.user.role !== "doctor" && req.user.role !== "secretary") {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Appointments");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// ➕ CREATE appointment (Secretary only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "secretary") {
    return res.status(403).json({ error: "Only secretaries can add appointments" });
  }

  const { patient_id, doctor_id, date, complaint } = req.body;

  try {
    const pool = await poolPromise;
    const id = require("crypto").randomUUID();

    await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .input("patient_id", sql.UniqueIdentifier, patient_id)
      .input("doctor_id", sql.UniqueIdentifier, doctor_id || null)
      .input("date", sql.Date, date)
      .input("complaint", sql.NVarChar, complaint)
      .query(`
        INSERT INTO Appointments (id, patient_id, doctor_id, date, complaint)
        VALUES (@id, @patient_id, @doctor_id, @date, @complaint)
      `);

    res.status(201).json({ message: "Appointment created" });
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

// ✏️ UPDATE appointment (Secretary only)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "secretary") {
    return res.status(403).json({ error: "Only secretaries can update appointments" });
  }

  const { patient_id, doctor_id, date, complaint } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input("id", sql.UniqueIdentifier, req.params.id)
      .input("patient_id", sql.UniqueIdentifier, patient_id)
      .input("doctor_id", sql.UniqueIdentifier, doctor_id || null)
      .input("date", sql.Date, date)
      .input("complaint", sql.NVarChar, complaint)
      .query(`
        UPDATE Appointments
        SET patient_id = @patient_id,
            doctor_id = @doctor_id,
            date = @date,
            complaint = @complaint
        WHERE id = @id
      `);

    res.json({ message: "Appointment updated" });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ error: "Failed to update appointment" });
  }
});

// ❌ DELETE appointment (Secretary only)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "secretary") {
    return res.status(403).json({ error: "Only secretaries can delete appointments" });
  }

  try {
    const pool = await poolPromise;

    await pool.request()
      .input("id", sql.UniqueIdentifier, req.params.id)
      .query("DELETE FROM Appointments WHERE id = @id");

    res.json({ message: "Appointment deleted" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
});

module.exports = router;
