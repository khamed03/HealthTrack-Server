const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

router.post('/', async (req, res) => {
  try {
    const { patient_id, date, diagnosis, treatment, notes, created_by } = req.body;

    const pool = await poolPromise;

    await pool
      .request()
      .input('patient_id', sql.UniqueIdentifier, patient_id)
      .input('date', sql.Date, date)
      .input('diagnosis', sql.NVarChar, diagnosis)
      .input('treatment', sql.NVarChar, treatment)
      .input('notes', sql.NVarChar, notes)
      .input('created_by', sql.UniqueIdentifier, created_by)
      .query(`
        INSERT INTO medical_records (patient_id, date, diagnosis, treatment, notes, created_by)
        VALUES (@patient_id, @date, @diagnosis, @treatment, @notes, @created_by)
      `);

    res.status(201).json({ message: 'Record inserted successfully.' });
  } catch (err) {
    console.error('Error inserting medical record:', err.message);
    res.status(500).json({ error: 'Failed to save medical record.' });
  }
});

module.exports = router;
