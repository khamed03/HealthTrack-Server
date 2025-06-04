const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");
const auth = require("../middleware/authMiddleware");

// GET all patients (Doctor + Secretary)
router.get("/", auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Patients");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});

// CREATE patient (Secretary only)
router.post("/", auth, async (req, res) => {
  const { full_name, dob, gender, created_by } = req.body;

  if (req.user.role !== "secretary") {
    return res.status(403).json({ error: "Only secretaries can add patients" });
  }

  try {
    const pool = await poolPromise;
    const patient_id = require("crypto").randomUUID();

    await pool.request()
      .input("patient_id", sql.UniqueIdentifier, patient_id)
      .input("full_name", sql.NVarChar, full_name)
      .input("dob", sql.Date, dob)
      .input("gender", sql.NVarChar, gender)
      .input("created_by", sql.UniqueIdentifier, created_by)
      .query(`
        INSERT INTO Patients (patient_id, full_name, dob, gender, created_by)
        VALUES (@patient_id, @full_name, @dob, @gender, @created_by)
      `);

    res.status(201).json({ message: "Patient added successfully" });
  } catch (err) {
    console.error("Error creating patient:", err);
    res.status(500).json({ error: "Failed to create patient" });
  }
});

// UPDATE patient (Doctor + Secretary)
router.put("/:id", auth, async (req, res) => {
  const { full_name, dob, gender } = req.body;

  if (req.user.role !== "secretary" && req.user.role !== "doctor") {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.UniqueIdentifier, req.params.id)
      .input("full_name", sql.NVarChar, full_name)
      .input("dob", sql.Date, dob)
      .input("gender", sql.NVarChar, gender)
      .query(`
        UPDATE Patients
        SET full_name = @full_name, dob = @dob, gender = @gender
        WHERE patient_id = @id
      `);

    res.json({ message: "Patient updated" });
  } catch (err) {
    console.error("Error updating patient:", err);
    res.status(500).json({ error: "Failed to update patient" });
  }
});

// DELETE patient (Secretary only)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "secretary") {
    return res.status(403).json({ error: "Only secretaries can delete patients" });
  }

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.UniqueIdentifier, req.params.id)
      .query("DELETE FROM Patients WHERE patient_id = @id");

    res.json({ message: "Patient deleted" });
  } catch (err) {
    console.error("Error deleting patient:", err);
    res.status(500).json({ error: "Failed to delete patient" });
  }
});

module.exports = router;
