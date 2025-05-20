const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

// GET /api/users/doctors
router.get('/doctors', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('role', sql.NVarChar, 'doctor')
      .query('SELECT * FROM users WHERE role = @role');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// GET /api/users/nurses
router.get('/nurses', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('role', sql.NVarChar, 'nurse')
      .query('SELECT * FROM users WHERE role = @role');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching nurses:', err);
    res.status(500).json({ error: 'Failed to fetch nurses' });
  }
});

module.exports = router;
