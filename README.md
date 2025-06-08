# 🩺 HealthTrack - Medical Record Management System

HealthTrack is a full-stack role-based web application for managing patients, medical records, and appointments in a clinic setting. The system supports two types of users: **Doctors** and **Secretaries**, each with distinct permissions and access levels.

## 🚀 Features

### ✅ User Roles

- **Doctor**
  - Full access to medical records (Create, Read, Update, Delete)
  - View and edit patient information
  - View appointments
- **Secretary**
  - Full control over patient data (CRUD)
  - Full control over appointments (CRUD)
  - View-only access to medical records

### ✅ Authentication

- Custom login and registration system
- Role assigned during registration
- Login redirects user based on role (Doctor → Dashboard, Secretary → Appointments)

### ✅ Dashboard

- Doctor-only access
- Displays:
  - Total number of patients
  - Total medical records
  - Total appointments

### ✅ Patient Management

- Doctors can view and edit patient info
- Secretaries can create, edit, delete, and view all patients

### ✅ Medical Record Management

- Doctors can create, edit, delete, and view records
- Records include:
  - Diagnosis
  - Treatment
  - Notes
  - Record date
- Secretaries can view records only

### ✅ Appointment Scheduling

- Secretaries manage appointments
- Doctors can view scheduled appointments (includes patient name, complaint, and date)

### ✅ Home Page

- Welcomes the user with the app logo
- Includes motivational quote of the day (from ZenQuotes API)
- Login and Register buttons
- Navigation to Login, Register, or return to Home

---

## 🛠 Tech Stack

| Frontend              | Backend              | Database     |
|-----------------------|----------------------|--------------|
| React + Vite + Bootstrap | Node.js + Express.js   | MSSQL        |
| React Router          | JWT Authentication   | UUIDs for PK |

---

## 📂 Folder Structure
```
HealthTrack-Server/
├── controllers/    # authController, patientController, etc.
├── routes/         # RESTful routes for all entities
├── middleware/     # authMiddleware for JWT + role check
├── db.js           # MSSQL connection
├── server.js       # Entry point
└── .env            # Database config
```


## 🌐 API Endpoints

The API will Run on: http://localhost:5000

### 🔐 Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

#### 🔐 Authentication Routes

`POST /api/auth/register`
```bash
{
  "email": "user@example.com",
  "password": "userPassword",
  "role": "doctor" // or "secretary"
}
```
`POST /api/auth/login`
```bash
{
  "email": "user@example.com",
  "password": "userPassword"
}
```
---

### 🩺 Patients
- `GET /api/patients`
- `POST /api/patients`
- `PUT /api/patients/:id`
- `DELETE /api/patients/:id`


#### 🧑‍⚕️ Patients Routes

`POST /api/patients`
```bash
{
  "full_name": "John Doe",
  "dob": "1990-05-20",
  "gender": "male",
  "created_by": "UUID-of-secretary-or-doctor"
}
```
`PUT /api/patients/:id`
```bash
{
  "full_name": "Updated Name",
  "dob": "1988-11-05",
  "gender": "female"
}
```
🔐 Only secretary (full CRUD) and doctor (view + edit) can update.

---

### 📋 Medical Records
- `GET /api/records`
- `POST /api/records`
- `PUT /api/records/:id`
- `DELETE /api/records/:id`

#### 📋 Medical Records Routes

`POST /api/records`
```bash
{
  "patient_id": "UUID-of-patient",
  "diagnosis": "Flu",
  "treatment": "Rest and fluids",
  "notes": "Patient should return in 1 week",
  "created_by": "UUID-of-doctor",
  "record_date": "2025-06-05"
}
```
🔐 Only doctors can create or update records.

`PUT /api/records/:id`
```bash
{
  "diagnosis": "Updated diagnosis",
  "treatment": "Updated treatment",
  "notes": "Follow-up in 2 weeks",
  "record_date": "2025-06-10"
}
```

### 📅 Appointments
- `GET /api/appointments`
- `POST /api/appointments`
- `PUT /api/appointments/:id`
- `DELETE /api/appointments/:id`

#### 📅 Appointments Routes

`POST /api/appointments`
```bash
{
  "patient_id": "UUID-of-patient",
  "doctor_id": "UUID-of-doctor",
  "date": "2025-06-10",
  "complaint": "Stomach pain"
}
```
🔐 Only secretaries can manage appointments.

`PUT /api/appointments/:id`
```bash
{
  "date": "2025-06-12",
  "complaint": "Rescheduled headache"
}
```

### 📊 Dashboard
- `GET /api/dashboard/count` — total patients, records, and appointments

---

## 📦 Deployment

- Frontend: Vite build deployed via [Railway](https://railway.app)
- Backend: Node.js API with MSSQL connected on Railway
- Ensure `vite.config.js` and all file casing are correct (Linux is case-sensitive)

---

## ✅ Getting Started

### 🔧 Run Backend
```bash
cd HealthTrack-Server
npm install
node server.js
```
Make sure .env contains:
```bash
DB_USER=your_db_user
DB_PASSWORD=your_password
DB_SERVER=your_server
DB_DATABASE=your_db_name
JWT_SECRET=your_jwt_secret
```

---
### 👨‍💻 Developed By

Khaled Hamed 

Fall 2024–2025 | Special Topics in Computer Science