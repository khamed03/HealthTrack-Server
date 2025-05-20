const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");
const { v4: uuidv4 } = require("uuid");

// GET /api/patients
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM patients");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});

// 👉 POST /api/patients
router.post("/", async (req, res) => {
  try {
    const { full_name, dob, gender, created_by } = req.body;
    const patient_id = uuidv4();

    const pool = await poolPromise;

    await pool
      .request()
      .input("patient_id", sql.UniqueIdentifier, patient_id)
      .input("full_name", sql.NVarChar, full_name)
      .input("dob", sql.Date, dob)
      .input("gender", sql.NVarChar, gender)
      .input("created_by", sql.UniqueIdentifier, created_by).query(`
        INSERT INTO patients (patient_id, full_name, dob, gender, created_by)
        VALUES (@patient_id, @full_name, @dob, @gender, @created_by)
      `);

    res
      .status(201)
      .json({ message: "Patient created successfully", patient_id });
  } catch (err) {
    console.error("Error creating patient:", err);
    res.status(500).json({ error: "Failed to create patient" });
  }
});

// PUT /api/patients/:patient_id
router.put('/:patient_id', async (req, res) => {
  try {
    const { patient_id } = req.params;
    const { full_name, dob, gender } = req.body;

    const pool = await poolPromise;

    await pool
      .request()
      .input('patient_id', sql.UniqueIdentifier, patient_id)
      .input('full_name', sql.NVarChar, full_name)
      .input('dob', sql.Date, dob)
      .input('gender', sql.NVarChar, gender)
      .query(`
        UPDATE patients
        SET full_name = @full_name, dob = @dob, gender = @gender
        WHERE patient_id = @patient_id
      `);

    res.status(200).json({ message: 'Patient updated successfully' });
  } catch (err) {
    console.error('Error updating patient:', err);
    res.status(500).json({ error: 'Failed to update patient' });
  }
});


module.exports = router;
