import { v4 as uuidv4 } from "uuid";
import pool from "../db.js";

// 📥 CREATE Medical Record
export const createRecord = async (req, res) => {
  try {
    const { patient_id, diagnosis, treatment, notes, created_by, record_date } = req.body;
    const id = uuidv4();

    const query = `
      INSERT INTO MedicalRecords (id, patient_id, diagnosis, treatment, notes, created_by, record_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    await pool.query(query, [id, patient_id, diagnosis, treatment, notes, created_by, record_date]);

    res.status(201).json({ message: "Medical record saved successfully" });
  } catch (error) {
    console.error("❌ Error inserting medical record:", error);
    res.status(500).json({ error: "Failed to save medical record" });
  }
};

// 📄 GET All Medical Records
export const getAllRecords = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT mr.*, p.full_name AS patient_name
      FROM MedicalRecords mr
      JOIN Patients p ON mr.patient_id = p.patient_id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching medical records:", error);
    res.status(500).json({ error: "Failed to fetch medical records" });
  }
};

// 🖊️ UPDATE Medical Record
export const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis, treatment, notes, record_date } = req.body;

    const query = `
      UPDATE MedicalRecords
      SET diagnosis = $1, treatment = $2, notes = $3, record_date = $4
      WHERE id = $5
    `;

    await pool.query(query, [diagnosis, treatment, notes, record_date, id]);

    res.json({ message: "Medical record updated successfully" });
  } catch (error) {
    console.error("❌ Error updating medical record:", error);
    res.status(500).json({ error: "Failed to update medical record" });
  }
};

// ❌ DELETE Medical Record
export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM MedicalRecords WHERE id = $1", [id]);

    res.json({ message: "Medical record deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting medical record:", error);
    res.status(500).json({ error: "Failed to delete medical record" });
  }
};
