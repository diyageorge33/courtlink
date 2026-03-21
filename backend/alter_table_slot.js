require('dotenv').config();
const pool = require("./src/db");

async function alterTable() {
  try {
    await pool.query(`ALTER TABLE advocate_schedules ADD COLUMN IF NOT EXISTS slot VARCHAR(20) DEFAULT 'WHOLE_DAY';`);
    console.log("Successfully added 'slot' column.");
  } catch (err) {
    console.error("Error altering table:", err);
  } finally {
    pool.end();
  }
}

alterTable();
