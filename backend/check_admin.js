const pool = require('./src/db');

(async () => {
  try {
    console.log("Checking admin user...");
    const admin = await pool.query("SELECT user_id, full_name, email, role, account_status FROM users WHERE LOWER(email)='admin@courtlink.com';");
    console.log("Admin result:", JSON.stringify(admin.rows, null, 2));
    
    console.log("\nChecking all users...");
    const users = await pool.query("SELECT user_id, full_name, email, role, account_status FROM users LIMIT 10;");
    console.log("All users:", JSON.stringify(users.rows, null, 2));
    
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await pool.end();
  }
})();
