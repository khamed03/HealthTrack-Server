import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patients.js";
import recordRoutes from "./routes/records.js";
import appointmentRoutes from "./routes/appointments.js";
import dashboardRoutes from "./routes/dashboard.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(cors({
  origin: "https://healthtrack-client-production.up.railway.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
console.log("CORS setup for frontend: https://healthtrack-client-production.up.railway.app");

app.options("*", cors());

//middleware
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/dashboard", dashboardRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
