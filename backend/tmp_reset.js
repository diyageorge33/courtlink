require('dotenv').config({ path: 'c:/Users/krish/digicourt/backend/.env' });
const pool = require('c:/Users/krish/digicourt/backend/src/db');
const bcrypt = require('bcrypt');

async function reset() {
  try {
    const hash = await bcrypt.hash('password123', 10);
    const result = await pool.query(
      'UPDATE users SET password_hash = $1, is_verified = true WHERE email = $2 RETURNING *',
      [hash, 'client@test.com']
    );
    if (result.rows.length > 0) {
      console.log('Successfully reset password for:', result.rows[0].email);
    } else {
      console.log('User not found: client@test.com');
      // If user not found, let's find all clients
      const clients = await pool.query("SELECT email FROM users WHERE role = 'CLIENT'");
      console.log('Found clients:', clients.rows);
    }
  } catch (e) {
    console.error('Reset failed:', e);
  } finally {
    process.exit(0);
  }
}

reset();
