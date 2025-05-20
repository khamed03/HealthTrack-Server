require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const recordRoutes = require('./routes/records');


app.use(cors());
app.use(express.json());

app.use('/api/records', recordRoutes);

app.get('/api/test-db', async (req, res) => {
  try {
    const pool = await require('./db').poolPromise;
    const result = await pool.request().query('SELECT GETDATE() AS currentTime');
    res.status(200).json({ success: true, time: result.recordset[0].currentTime });
  } catch (err) {
    console.error('Database test failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
