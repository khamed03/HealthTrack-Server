const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql, poolPromise } = require("../db");

// Register
exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const pool = await poolPromise;

    const check = await pool.request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM Users WHERE email = @email");

    if (check.recordset.length > 0) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user_id = require("crypto").randomUUID();

    await pool.request()
      .input("user_id", sql.UniqueIdentifier, user_id)
      .input("email", sql.NVarChar, email)
      .input("password_hash", sql.NVarChar, hashed)
      .input("role", sql.NVarChar, role)
      .query(`
        INSERT INTO Users (user_id, email, password_hash, role)
        VALUES (@user_id, @email, @password_hash, @role)
      `);

    res.status(201).json({ message: "User registered successfully." });

  } catch (err) {
    console.error("❌ Register error:", err);  // Add this line
    res.status(500).json({ error: "Server error during registration." });
  }
};


// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM Users WHERE email = @email");

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const payload = {
      user_id: user.user_id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });

    res.json({ token, role: user.role, user_id: user.user_id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login." });
  }
};
