require('dotenv').config();
const pool = require("./src/db");

async function createSchedulesTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS advocate_schedules (
        schedule_id SERIAL PRIMARY KEY,
        advocate_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        date DATE NOT NULL,
        reason VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
    console.log("Table 'advocate_schedules' created successfully.");
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    pool.end();
  }
}

createSchedulesTable();
