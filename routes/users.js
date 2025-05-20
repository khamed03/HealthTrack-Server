const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

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




module.exports = router;
