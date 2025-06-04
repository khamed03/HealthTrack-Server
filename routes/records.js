const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");
const auth = require("../middleware/authMiddleware");

// GET records for a specific patient (Doctor + Secretary)
router.get("/:patient_id", auth, async (req, res) => {
  const { patient_id } = req.params;

  if (req.user.role !== "doctor" && req.user.role !== "secretary") {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("patient_id", sql.UniqueIdentifier, patient_id)
      .query("SELECT * FROM MedicalRecords WHERE patient_id = @patient_id");

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching records:", err);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// CREATE medical record (Doctor only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ error: "Only doctors can create records" });
  }

  const { patient_id, diagnosis, treatment, notes, created_by, record_date } = req.body;


  try {
    const pool = await poolPromise;
    const record_id = require("crypto").randomUUID();

    await pool.request()
      .input("record_id", sql.UniqueIdentifier, record_id)
      .input("patient_id", sql.UniqueIdentifier, patient_id)
      .input("diagnosis", sql.NVarChar, diagnosis)
      .input("treatment", sql.NVarChar, treatment)
      .input("notes", sql.NVarChar, notes)
      .input("created_by", sql.UniqueIdentifier, created_by)
      .input("record_date", sql.Date, record_date)
      .query(`
        INSERT INTO MedicalRecords (id, patient_id, diagnosis, treatment, notes, created_by, record_date)
        VALUES (@record_id, @patient_id, @diagnosis, @treatment, @notes, @created_by, @record_date)
      `);


    res.status(201).json({ message: "Record created successfully" });
  } catch (err) {
    console.error("Error creating record:", err);
    res.status(500).json({ error: "Failed to save medical record" });
  }
});

// UPDATE record (Doctor only)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ error: "Only doctors can update records" });
  }

  const { diagnosis, treatment, notes } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.UniqueIdentifier, req.params.id)
      .input("diagnosis", sql.NVarChar, diagnosis)
      .input("treatment", sql.NVarChar, treatment)
      .input("notes", sql.NVarChar, notes)
      .query(`
        UPDATE MedicalRecords
        SET diagnosis = @diagnosis, treatment = @treatment, notes = @notes
        WHERE id = @id
      `);

    res.json({ message: "Record updated" });
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).json({ error: "Failed to update record" });
  }
});

// DELETE record (Doctor only)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ error: "Only doctors can delete records" });
  }

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.UniqueIdentifier, req.params.id)
      .query("DELETE FROM MedicalRecords WHERE id = @id");

    res.json({ message: "Record deleted" });
  } catch (err) {
    console.error("Error deleting record:", err);
    res.status(500).json({ error: "Failed to delete record" });
  }
});

// GET all records (Doctor dashboard stat)
router.get("/all", auth, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ error: "Only doctors can access all records" });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM MedicalRecords");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error getting all records:", err);
    res.status(500).json({ error: "Failed to load records" });
  }
});

module.exports = router;
