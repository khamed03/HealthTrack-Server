import pool from "../db.js";

export const getDashboardCounts = async (req, res) => {
  try {
    const patients = await pool.query("SELECT COUNT(*) FROM Patients");
    const records = await pool.query("SELECT COUNT(*) FROM MedicalRecords");
    const appointments = await pool.query("SELECT COUNT(*) FROM Appointments");

    res.json({
      totalPatients: parseInt(patients.rows[0].count),
      totalRecords: parseInt(records.rows[0].count),
      totalAppointments: parseInt(appointments.rows[0].count),
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard counts:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
