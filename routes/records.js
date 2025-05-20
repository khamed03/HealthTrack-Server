const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

// GET /api/records/:patient_id
router.get('/:patient_id', async (req, res) => {
  try {
    const { patient_id } = req.params;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('patient_id', sql.UniqueIdentifier, patient_id)
      .query(`
        SELECT * FROM medical_records
        WHERE patient_id = @patient_id
        ORDER BY date DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching records:', err);
    res.status(500).json({ error: 'Failed to fetch medical records' });
  }
});

module.exports = router;
