const pool = require("../db");

/* GET ALL CLIENTS */
exports.getClients = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, full_name, email
       FROM users
       WHERE role='CLIENT'`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* GET ALL ADVOCATES */

exports.getAdvocates = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.user_id, u.full_name, a.specialization, a.experience_years
       FROM users u
       JOIN advocate_profiles a
       ON u.user_id = a.advocate_id`
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

  try {

    await pool.query(
      `INSERT INTO case_assignments
       (case_id, advocate_id, assigned_by)
       VALUES ($1,$2,$3)`,
      [caseId, advocateId, req.user.user_id]
    );

    res.json({ message: "Advocate assigned successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Assignment failed" });
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
        u.full_name AS advocate_name
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
       WHERE LOWER(a.specialization) LIKE
       LOWER((SELECT case_type FROM cases WHERE case_id=$1))`,
      [caseId]

    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Error suggesting advocates" });

  }

};