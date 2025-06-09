const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');
const { v4: uuidv4 } = require('uuid');

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

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

    res.status(201).json({ message: 'User created', user_id });
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ error: 'Failed to create user' });
  }
});



// GET /api/users/doctors
router.get("/doctors", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("role", sql.NVarChar, "doctor")
      .query("SELECT * FROM users WHERE role = @role");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// GET /api/users/nurses
router.get("/nurses", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("role", sql.NVarChar, "nurse")
      .query("SELECT * FROM users WHERE role = @role");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching nurses:", err);
    res.status(500).json({ error: "Failed to fetch nurses" });
  }
});

// PUT /api/users/:user_id
router.put('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { name, email, role } = req.body;

    const pool = await poolPromise;

    await pool
      .request()
      .input('user_id', sql.UniqueIdentifier, user_id)
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('role', sql.NVarChar, role)
      .query(`
        UPDATE users
        SET name = @name, email = @email, role = @role
        WHERE user_id = @user_id
      `);

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});


// DELETE /api/users/:user_id
router.delete('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const pool = await poolPromise;

    await pool
      .request()
      .input('user_id', sql.UniqueIdentifier, user_id)
      .query(`DELETE FROM users WHERE user_id = @user_id`);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


export default router;
