const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');
const { v4: uuidv4 } = require('uuid');

// 👉 POST /api/users
router.post('/', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user_id = uuidv4();

    const pool = await poolPromise;

    await pool
      .request()
      .input('user_id', sql.UniqueIdentifier, user_id)
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('role', sql.NVarChar, role)
      .query(`
        INSERT INTO users (user_id, name, email, role)
        VALUES (@user_id, @name, @email, @role)
      `);

    res.status(201).json({ message: 'User created successfully', user_id });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = router;
