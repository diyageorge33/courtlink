const pool = require("../db");

let auditLogsTableInitPromise = null;

function ensureAuditLogsTable() {
  if (!auditLogsTableInitPromise) {
    auditLogsTableInitPromise = pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        log_id SERIAL PRIMARY KEY,
        case_id INT REFERENCES cases(case_id) ON DELETE CASCADE,
        action TEXT NOT NULL,
        performed_by INT REFERENCES users(user_id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  return auditLogsTableInitPromise;
}

module.exports = {
  ensureAuditLogsTable,
};
