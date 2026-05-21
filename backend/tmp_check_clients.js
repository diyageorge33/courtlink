const pool = require('./src/db');
(async () => {
  try {
    const clients = await pool.query("SELECT user_id, full_name, email, role, account_status FROM users WHERE LOWER(role)='client';");
    console.log('clients rows:', clients.rows);
    const admins = await pool.query("SELECT user_id, full_name, email, role, account_status FROM users WHERE LOWER(role)='admin';");
    console.log('admins rows:', admins.rows);
  } catch (err) {
    console.error('error', err);
  } finally {
    await pool.end();
  }
})();