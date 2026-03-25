const pool = require('./src/db');

(async () => {
  try {
    console.log("Updating admin user account status...");
    const updateResult = await pool.query(
      "UPDATE users SET account_status = 'ACTIVE' WHERE email = 'admin@courtlink.com' RETURNING user_id, full_name, email, role, account_status;"
    );
    
    if (updateResult.rows.length > 0) {
      console.log("Admin user updated:", JSON.stringify(updateResult.rows[0], null, 2));
    } else {
      console.log("No admin user found with email admin@courtlink.com");
      console.log("Inserting admin user...");
      const insertResult = await pool.query(
        `INSERT INTO users (full_name, email, password_hash, role, is_verified, account_status)
         VALUES ('System Admin', 'admin@courtlink.com', '$2b$10$7Oj4qfF.WqRYBdXWjrZZy.HDi8JOFPZpypoUoGdFefsz2x2AXkkDu', 'ADMIN', true, 'ACTIVE')
         RETURNING user_id, full_name, email, role, account_status;`
      );
      console.log("Admin user inserted:", JSON.stringify(insertResult.rows[0], null, 2));
    }
    
  } catch (err) {
    console.error('Error updating admin user:', err.message);
  } finally {
    await pool.end();
  }
})();
