const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.js");
const patientRoutes = require("./routes/patients.js");
const recordRoutes = require("./routes/records.js");
const appointmentRoutes = require("./routes/appointments.js");
const dashboardRoutes = require("./routes/dashboard.js");

const app = express();
app.use(cors({
  origin: "https://healthtrack-client-production.up.railway.app"
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => res.send("HealthTrack API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
