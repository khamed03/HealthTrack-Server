import { v4 as uuidv4 } from "uuid";
import pool from "../db.js";

// 📥 CREATE Appointment
export const createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, date, complaint } = req.body;
    const id = uuidv4();

    const query = `
      INSERT INTO Appointments (id, patient_id, doctor_id, date, complaint)
      VALUES ($1, $2, $3, $4, $5)
    `;

    await pool.query(query, [id, patient_id, doctor_id, date, complaint]);

    res.status(201).json({ message: "Appointment created successfully" });
  } catch (error) {
    console.error("❌ Error creating appointment:", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

// 📄 GET All Appointments
export const getAllAppointments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, p.full_name AS patient_name
      FROM Appointments a
      JOIN Patients p ON a.patient_id = p.patient_id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// 🖊️ UPDATE Appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, complaint } = req.body;

    const query = `
      UPDATE Appointments
      SET date = $1, complaint = $2
      WHERE id = $3
    `;

    await pool.query(query, [date, complaint, id]);

    res.json({ message: "Appointment updated successfully" });
  } catch (error) {
    console.error("❌ Error updating appointment:", error);
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

// ❌ DELETE Appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM Appointments WHERE id = $1", [id]);

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};
