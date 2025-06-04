const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const patientRoutes = require("./routes/patients");
const recordRoutes = require("./routes/records");
const appointmentRoutes = require("./routes/appointments");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Required for JSON body parsing

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/appointments", appointmentRoutes);

// Fallback route (optional)
app.use("/", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
