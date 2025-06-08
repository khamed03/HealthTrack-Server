import dotenv from "dotenv";
dotenv.config(); // ⬅️ MUST come before anything else

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : false,
});

console.log("PG Config:", {
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

export default pool;
