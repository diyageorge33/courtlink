require('dotenv').config();
const pool = require("./src/db");

async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS advocate_resignations (
        request_id SERIAL PRIMARY KEY,
        advocate_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        reason TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'PENDING',
        requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Successfully created table advocate_resignations");
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    pool.end();
  }
}

createTable();
