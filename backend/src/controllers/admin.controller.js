const pool = require("../db");

/* GET ALL CLIENTS */
exports.getClients = async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {

    const result = await pool.query(
      `SELECT u.user_id,
              u.full_name,
              u.email,
              cp.phone,
              cp.address,
              cp.dob,
              cp.gender,
              COALESCE(
                (
                  SELECT STRING_AGG(c.case_title, ', ' ORDER BY c.case_id)
                  FROM cases c
                  WHERE c.client_id = u.user_id
                ),
                'No cases filed'
              ) AS case_names
       FROM users u
       LEFT JOIN client_profiles cp ON cp.client_id = u.user_id
       WHERE u.role='CLIENT'
       ORDER BY u.user_id DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const total = await pool.query(
      `SELECT COUNT(*) FROM users WHERE role='CLIENT'`
    );

    res.json({
      clients: result.rows,
      total: parseInt(total.rows[0].count)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching clients" });
  }

};

/* GET ALL ADVOCATES */

exports.getAdvocates = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.user_id, u.full_name, u.account_status,
            a.specialization, a.experience_years
       FROM users u
       JOIN advocate_profiles a
       ON u.user_id = a.advocate_id
       WHERE u.role='ADVOCATE'`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* GET ALL CASES */

exports.getCases = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.case_id,
              c.case_title,
              c.case_type,
              c.status,
              c.advocate_id,
              u.full_name AS client_name,
              a.full_name AS advocate_name
       FROM cases c
       JOIN users u ON c.client_id = u.user_id
       LEFT JOIN users a ON c.advocate_id = a.user_id`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ASSIGN ADVOCATE */

exports.assignAdvocate = async (req, res) => {

  const { caseId, advocateId } = req.body;
  const adminId = req.user.user_id;

  try {

    /* STORE ASSIGNMENT HISTORY */

    await pool.query(
      `INSERT INTO case_assignments (case_id, advocate_id, assigned_by)
       VALUES ($1,$2,$3)`,
      [caseId, advocateId, adminId]
    );

    /* UPDATE CURRENT ADVOCATE */

    await pool.query(
      `UPDATE cases
       SET advocate_id = $1
       WHERE case_id = $2`,
      [advocateId, caseId]
    );

    /* LOG ACTIVITY */
    await pool.query(
      `INSERT INTO audit_logs (case_id, action, performed_by)
       VALUES ($1, $2, $3)`,
      [caseId, 'Advocate Assigned', adminId]
    );

    res.json({
      message: "Advocate assigned successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error assigning advocate" });
  }

};

/* REASSIGN ADVOCATE */

exports.reassignAdvocate = async (req, res) => {

  const { caseId, advocateId } = req.body;

  try {

    await pool.query(
      `UPDATE cases
       SET advocate_id=$1
       WHERE case_id=$2`,
      [advocateId, caseId]
    );

    /* LOG ACTIVITY */
    await pool.query(
      `INSERT INTO audit_logs (case_id, action, performed_by)
       VALUES ($1, $2, $3)`,
      [caseId, 'Advocate Reassigned', req.user.user_id]
    );

    res.json({ message: "Advocate reassigned successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Reassignment failed" });
  }
};

exports.getClientCases = async (req, res) => {
  const { clientId } = req.params;

  try {

    const result = await pool.query(
      `SELECT 
        c.case_id,
        c.case_title,
        c.case_type,
        c.case_description,
        c.status,
        c.advocate_id,
        adv.full_name AS advocate_name,
        (
            SELECT u2.full_name
            FROM case_assignments ca
            JOIN users u2 ON u2.user_id = ca.advocate_id
            WHERE ca.case_id = c.case_id
            ORDER BY ca.assigned_at DESC
            OFFSET 1 LIMIT 1
        ) AS previous_advocate
       FROM cases c
       LEFT JOIN users adv
       ON c.advocate_id = adv.user_id
       WHERE c.client_id = $1`,
      [clientId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching client cases" });
  }
};

exports.suggestAdvocates = async (req, res) => {

  const { caseId } = req.params;

  try {

    const result = await pool.query(

      `SELECT a.advocate_id,
              u.full_name,
              a.specialization,
              a.experience_years
       FROM advocate_profiles a
       JOIN users u
       ON a.advocate_id = u.user_id
       WHERE u.account_status = true
       AND LOWER(a.specialization) LIKE
       '%' || LOWER((SELECT case_type FROM cases WHERE case_id=$1)) || '%'`,
      [caseId]

    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Error suggesting advocates" });

  }

};

exports.getClosedCases = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT 
        c.case_id,
        c.case_title,
        c.case_type,
        c.status,
        u.full_name AS client_name,
        a.full_name AS advocate_name
      FROM cases c
      JOIN users u ON c.client_id = u.user_id
      LEFT JOIN users a ON c.advocate_id = a.user_id
      WHERE c.status = 'CLOSED'
      ORDER BY c.case_id DESC`
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching closed cases" });
  }
};

exports.closeCase = async (req, res) => {

  const { caseId } = req.params;

  try {

    await pool.query(
      `UPDATE cases
       SET status='CLOSED'
       WHERE case_id=$1`,
      [caseId]
    );

    /* LOG ACTIVITY */
    await pool.query(
      `INSERT INTO audit_logs (case_id, action, performed_by)
       VALUES ($1, $2, $3)`,
      [caseId, 'Case Closed', req.user.user_id]
    );

    res.json({ message: "Case closed successfully" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Error closing case" });

  }

};

exports.rejectCase = async (req, res) => {

  const { caseId } = req.params;

  try {

    await pool.query(
      `UPDATE cases
       SET status='REJECTED'
       WHERE case_id=$1`,
      [caseId]
    );

    /* LOG ACTIVITY */
    await pool.query(
      `INSERT INTO audit_logs (case_id, action, performed_by)
       VALUES ($1, $2, $3)`,
      [caseId, 'Case Rejected', req.user.user_id]
    );

    res.json({ message: "Case rejected successfully" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Error rejecting case" });

  }

};

exports.getPendingCases = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.case_id,
              c.case_title,
              c.case_type,
              c.case_description,
              c.status,
              u.full_name AS client_name
       FROM cases c
       JOIN users u ON c.client_id = u.user_id
       WHERE c.status = 'PENDING'
       ORDER BY c.case_id DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching pending cases" });
  }
};

exports.approveCase = async (req, res) => {
  const { caseId } = req.params;
  try {
    await pool.query(
      `UPDATE cases SET status = 'ONGOING' WHERE case_id = $1`,
      [caseId]
    );

    /* LOG ACTIVITY */
    await pool.query(
      `INSERT INTO audit_logs (case_id, action, performed_by)
       VALUES ($1, $2, $3)`,
      [caseId, 'Case Approved', req.user.user_id]
    );

    res.json({ message: "Case approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error approving case" });
  }
};

exports.getAdminStats = async (req, res) => {
  try {

    const totalCases = await pool.query(
      "SELECT COUNT(*) FROM cases"
    );

    const totalAdvocates = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role='ADVOCATE'"
    );

    const pendingCases = await pool.query(
      "SELECT COUNT(*) FROM cases WHERE status='PENDING'"
    );

    const activeCases = await pool.query(
      "SELECT COUNT(*) FROM cases WHERE status='ONGOING'"
    );

    const closedCases = await pool.query(
      "SELECT COUNT(*) FROM cases WHERE status='CLOSED'"
    );

    res.json({
      totalCases: parseInt(totalCases.rows[0].count),
      activeCases: parseInt(activeCases.rows[0].count),
      closedCases: parseInt(closedCases.rows[0].count),
      totalAdvocates: parseInt(totalAdvocates.rows[0].count),
      pendingCases: parseInt(pendingCases.rows[0].count)
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Error fetching admin statistics" });

  }
};

exports.reopenCase = async (req, res) => {

  const { caseId } = req.params;

  try {

    await pool.query(
      `UPDATE cases
       SET status = 'ONGOING'
       WHERE case_id = $1`,
      [caseId]
    );

    /* LOG ACTIVITY */
    await pool.query(
      `INSERT INTO audit_logs (case_id, action, performed_by)
       VALUES ($1, $2, $3)`,
      [caseId, 'Case Reopened', req.user.user_id]
    );

    res.json({ message: "Case reopened successfully" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Error reopening case" });

  }

};



exports.deleteAdvocate = async (req, res) => {

  const { advocateId } = req.params;

  try {

    /* CHECK IF ADVOCATE HAS ACTIVE CASES */

    const activeCases = await pool.query(
      `SELECT case_id
       FROM cases
       WHERE advocate_id = $1
       AND status != 'CLOSED'`,
      [advocateId]
    );

    if (activeCases.rows.length > 0) {

      return res.status(400).json({
        message: "Advocate cannot be deleted because active cases are assigned"
      });

    }

    /* DELETE ADVOCATE */

    await pool.query(
      `UPDATE users
       SET account_status = false
       WHERE user_id = $1`,
      [advocateId]
    );

    /* LOG ACTIVITY */
    await pool.query(
      `INSERT INTO audit_logs (action, performed_by)
       VALUES ($1, $2)`,
      ['Advocate Suspended: ' + advocateId, req.user.user_id]
    );

    res.json({
      message: "Advocate deleted successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error while deleting advocate"
    });

  }

};

exports.restoreAdvocate = async (req, res) => {

  const { advocateId } = req.params;

  try {

    await pool.query(
      `UPDATE users
       SET account_status = true
       WHERE user_id = $1`,
      [advocateId]
    );

    /* LOG ACTIVITY */
    await pool.query(
      `INSERT INTO audit_logs (action, performed_by)
       VALUES ($1, $2)`,
      ['Advocate Restored: ' + advocateId, req.user.user_id]
    );

    res.json({
      message: "Advocate restored successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Error restoring advocate"
    });

  }

};

exports.getCaseTimeline = async (req, res) => {
  const { caseId } = req.params;
  try {
    const result = await pool.query(
      `SELECT timeline.action, timeline.created_at, timeline.performed_by
       FROM (
         SELECT a.action, a.created_at, u.full_name AS performed_by
         FROM audit_logs a
         LEFT JOIN users u ON a.performed_by = u.user_id
         WHERE a.case_id = $1

         UNION ALL

         SELECT 'Case Filed' AS action,
                c.created_at,
                u.full_name AS performed_by
         FROM cases c
         JOIN users u ON u.user_id = c.client_id
         WHERE c.case_id = $1
           AND NOT EXISTS (
             SELECT 1
             FROM audit_logs a2
             WHERE a2.case_id = c.case_id
               AND a2.action = 'Case Filed'
           )
       ) AS timeline
       ORDER BY timeline.created_at ASC`,
      [caseId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching timeline" });
  }
};

exports.getAnalyticsData = async (req, res) => {
  try {
    const statusResult = await pool.query(
      "SELECT status, COUNT(*) FROM cases GROUP BY status"
    );
    const typeResult = await pool.query(
      "SELECT case_type, COUNT(*) FROM cases GROUP BY case_type"
    );
    const recentActivity = await pool.query(
      `SELECT a.action, u.full_name, a.created_at, c.case_title
       FROM audit_logs a
       JOIN users u ON a.performed_by = u.user_id
       LEFT JOIN cases c ON a.case_id = c.case_id
       ORDER BY a.created_at DESC
       LIMIT 5`
    );

    res.json({
      statusStats: statusResult.rows,
      typeStats: typeResult.rows,
      recentActivity: recentActivity.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};

exports.getClosureRequests = async (req, res) => {
  try {

    // 🟡 PENDING CLIENT CLOSURES
    const clientClosures = await pool.query(
      `SELECT user_id,
              full_name,
              email,
              'CLIENT' AS role,
              account_status,
              NULL AS reason,
              NULL AS requested_at
       FROM users
       WHERE role = 'CLIENT'
       AND account_status = 'PENDING_CLOSURE'
       ORDER BY user_id DESC`
    );

    // 🔵 CLOSED CLIENTS (NEW - for revive)
    const closedClients = await pool.query(
      `SELECT user_id,
              full_name,
              email,
              'CLIENT' AS role,
              account_status,
              NULL AS reason,
              NULL AS requested_at
       FROM users
       WHERE role = 'CLIENT'
       AND account_status = 'CLOSED'
       ORDER BY user_id DESC`
    );

    // 🟣 ADVOCATE RESIGNATIONS
    const advocateClosures = await pool.query(
      `SELECT u.user_id,
              u.full_name,
              u.email,
              'ADVOCATE' AS role,
              ar.status AS account_status,
              ar.reason,
              ar.requested_at
       FROM advocate_resignations ar
       JOIN users u ON u.user_id = ar.advocate_id
       WHERE ar.status = 'PENDING'
       ORDER BY ar.requested_at DESC`
    );

    res.json({
      clients: clientClosures.rows,
      closedClients: closedClients.rows, // 👈 NEW
      advocates: advocateClosures.rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching closure requests" });
  }
};

exports.approveClientClosure = async (req, res) => {
  const { clientId } = req.params;

  try {
    await pool.query(
      `UPDATE users
       SET account_status = 'CLOSED'
       WHERE user_id = $1
       AND role = 'CLIENT'`,
      [clientId]
    );

    await pool.query(
      `INSERT INTO audit_logs (action, performed_by)
       VALUES ($1, $2)`,
      [`Client Closure Approved: ${clientId}`, req.user.user_id]
    );

    res.json({ message: "Client closure approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error approving client closure" });
  }
};

exports.rejectClientClosure = async (req, res) => {
  const { clientId } = req.params;

  try {
    await pool.query(
      `UPDATE users
       SET account_status = 'ACTIVE'
       WHERE user_id = $1
       AND role = 'CLIENT'`,
      [clientId]
    );

    await pool.query(
      `INSERT INTO audit_logs (action, performed_by)
       VALUES ($1, $2)`,
      [`Client Closure Rejected: ${clientId}`, req.user.user_id]
    );

    res.json({ message: "Client closure rejected successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error rejecting client closure" });
  }
};

exports.approveAdvocateClosure = async (req, res) => {
  const { advocateId } = req.params;

  try {
    await pool.query(
      `UPDATE advocate_resignations
       SET status = 'APPROVED'
       WHERE advocate_id = $1
       AND status = 'PENDING'`,
      [advocateId]
    );

    await pool.query(
      `UPDATE users
       SET account_status = false
       WHERE user_id = $1
       AND role = 'ADVOCATE'`,
      [advocateId]
    );

    await pool.query(
      `INSERT INTO audit_logs (action, performed_by)
       VALUES ($1, $2)`,
      [`Advocate Closure Approved: ${advocateId}`, req.user.user_id]
    );

    res.json({ message: "Advocate closure approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error approving advocate closure" });
  }
};

exports.rejectAdvocateClosure = async (req, res) => {
  const { advocateId } = req.params;

  try {
    await pool.query(
      `UPDATE advocate_resignations
       SET status = 'REJECTED'
       WHERE advocate_id = $1
       AND status = 'PENDING'`,
      [advocateId]
    );

    await pool.query(
      `INSERT INTO audit_logs (action, performed_by)
       VALUES ($1, $2)`,
      [`Advocate Closure Rejected: ${advocateId}`, req.user.user_id]
    );

    res.json({ message: "Advocate closure rejected successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error rejecting advocate closure" });
  }
};

exports.reviveClientAccount = async (req, res) => {
  const { clientId } = req.params;

  try {

    await pool.query(
      `UPDATE users
       SET account_status = 'ACTIVE'
       WHERE user_id = $1
       AND role = 'CLIENT'`,
      [clientId]
    );

    await pool.query(
      `INSERT INTO audit_logs (action, performed_by)
       VALUES ($1, $2)`,
      [`Client Account Revived: ${clientId}`, req.user.user_id]
    );

    res.json({ message: "Client account revived successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error reviving account" });
  }
};
