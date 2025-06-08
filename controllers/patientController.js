import { v4 as uuidv4 } from "uuid";
import pool from "../db.js";

// 📥 CREATE Patient
export const createPatient = async (req, res) => {
  try {
    const { full_name, dob, gender, created_by } = req.body;
    const patient_id = uuidv4();

    const query = `
      INSERT INTO Patients (patient_id, full_name, dob, gender, created_by)
      VALUES ($1, $2, $3, $4, $5)
    `;

    await pool.query(query, [patient_id, full_name, dob, gender, created_by]);

    res.status(201).json({ message: "Patient created successfully" });
  } catch (error) {
    console.error("❌ Error creating patient:", error);
    res.status(500).json({ error: "Failed to create patient" });
  }
};

// 📄 GET All Patients
export const getAllPatients = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Patients");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching patients:", error);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
};

// 🖊️ UPDATE Patient
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, dob, gender } = req.body;

    const query = `
      UPDATE Patients
      SET full_name = $1, dob = $2, gender = $3
      WHERE patient_id = $4
    `;

    await pool.query(query, [full_name, dob, gender, id]);

    res.json({ message: "Patient updated successfully" });
  } catch (error) {
    console.error("❌ Error updating patient:", error);
    res.status(500).json({ error: "Failed to update patient" });
  }
};

// ❌ DELETE Patient
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      DELETE FROM Patients
      WHERE patient_id = $1
    `;

    await pool.query(query, [id]);

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting patient:", error);
    res.status(500).json({ error: "Failed to delete patient" });
  }
};
