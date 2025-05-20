const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { sql, poolPromise } = require("../db");

// GET /api/records/:patient_id
router.get("/:patient_id", async (req, res) => {
  try {
    const { patient_id } = req.params;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("patient_id", sql.UniqueIdentifier, patient_id).query(`
        SELECT * FROM medical_records
        WHERE patient_id = @patient_id
        ORDER BY date DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching records:", err);
    res.status(500).json({ error: "Failed to fetch medical records" });
  }
});

router.post('/', async (req, res) => {
  try {
    const { patient_id, date, diagnosis, treatment, notes, created_by } = req.body;

    // Validate required fields
    if (!patient_id || !date || !diagnosis || !treatment || !created_by) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const record_id = uuidv4();
    const pool = await poolPromise;

    await pool
      .request()
      .input('record_id', sql.UniqueIdentifier, record_id)
      .input('patient_id', sql.UniqueIdentifier, patient_id)
      .input('date', sql.Date, date)
      .input('diagnosis', sql.NVarChar, diagnosis)
      .input('treatment', sql.NVarChar, treatment)
      .input('notes', sql.NVarChar, notes || '')
      .input('created_by', sql.UniqueIdentifier, created_by)
      .query(`
        INSERT INTO medical_records (id, patient_id, date, diagnosis, treatment, notes, created_by)
        VALUES (@record_id, @patient_id, @date, @diagnosis, @treatment, @notes, @created_by)
      `);

    res.status(201).json({ message: 'Medical record added successfully', record_id });
  } catch (err) {
    console.error('Error inserting medical record:', err);
    res.status(500).json({ error: 'Failed to save medical record' });
  }
});

// PUT /api/records/:record_id
router.put('/:record_id', async (req, res) => {
  try {
    const { record_id } = req.params;
    const { date, diagnosis, treatment, notes } = req.body;

    const pool = await poolPromise;

    await pool
      .request()
      .input('record_id', sql.UniqueIdentifier, record_id)
      .input('date', sql.Date, date)
      .input('diagnosis', sql.NVarChar, diagnosis)
      .input('treatment', sql.NVarChar, treatment)
      .input('notes', sql.NVarChar, notes || '')
      .query(`
        UPDATE medical_records
        SET date = @date,
            diagnosis = @diagnosis,
            treatment = @treatment,
            notes = @notes
        WHERE id = @record_id
      `);

    res.status(200).json({ message: 'Medical record updated successfully' });
  } catch (err) {
    console.error('Error updating medical record:', err);
    res.status(500).json({ error: 'Failed to update medical record' });
  }
});


// DELETE /api/records/:record_id
router.delete('/:record_id', async (req, res) => {
  try {
    const { record_id } = req.params;

    const pool = await poolPromise;

    await pool
      .request()
      .input('record_id', sql.UniqueIdentifier, record_id)
      .query(`DELETE FROM medical_records WHERE id = @record_id`);

    res.status(200).json({ message: 'Medical record deleted successfully' });
  } catch (err) {
    console.error('Error deleting medical record:', err.message);
    res.status(500).json({ error: 'Failed to delete medical record' });
  }
});



module.exports = router;
