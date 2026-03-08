const pool = require("../db");

/* GET ALL CLIENTS */
exports.getClients = async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {

    const result = await pool.query(
      `SELECT user_id, full_name, email
       FROM users
       WHERE role='CLIENT'
       ORDER BY user_id DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const total = await pool.query(
      `SELECT COUNT(*) FROM users WHERE role='CLIENT'`
    );

    res.json({
      clients: result.rows,
      total: total.rows[0].count
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
      `SELECT u.user_id, u.full_name, u.is_active,
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
              u.full_name AS client_name
       FROM cases c
       JOIN users u
       ON c.client_id = u.user_id`
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
        u.full_name AS advocate_name,
        (
            SELECT u2.full_name
            FROM case_assignments ca
            JOIN users u2 ON u2.user_id = ca.advocate_id
            WHERE ca.case_id = c.case_id
            ORDER BY ca.assigned_at DESC
            OFFSET 1 LIMIT 1
        ) AS previous_advocate
       FROM cases c
       LEFT JOIN users u
       ON c.advocate_id = u.user_id
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
       WHERE u.is_active = true
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

    res.json({ message: "Case closed successfully" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Error closing case" });

  }

};

exports.getAdminStats = async (req, res) => {
  try {

    const totalCases = await pool.query(
      "SELECT COUNT(*) FROM cases"
    );

    const activeCases = await pool.query(
      "SELECT COUNT(*) FROM cases WHERE status='ONGOING'"
    );

    const closedCases = await pool.query(
      "SELECT COUNT(*) FROM cases WHERE status='CLOSED'"
    );

    const totalAdvocates = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role='ADVOCATE'"
    );

    res.json({
      totalCases: totalCases.rows[0].count,
      activeCases: activeCases.rows[0].count,
      closedCases: closedCases.rows[0].count,
      totalAdvocates: totalAdvocates.rows[0].count
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
       SET is_active = false
       WHERE user_id = $1`,
      [advocateId]
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
       SET is_active = true
       WHERE user_id = $1`,
      [advocateId]
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