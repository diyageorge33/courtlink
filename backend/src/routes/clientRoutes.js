const express = require("express");
const router = express.Router();
const pool = require("../db");

const multer = require("multer");
const path = require("path");

// ===============================
// MULTER CONFIG (LOCAL STORAGE)
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ===============================
// GET CLIENT DASHBOARD STATS
// ===============================
router.get("/dashboard/stats/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    const ongoingResult = await pool.query(
      `SELECT COUNT(*) 
       FROM cases 
       WHERE client_id = $1 
       AND status IN ('PENDING', 'APPROVED', 'ONGOING')`,
      [clientId]
    );

    const upcomingResult = await pool.query(
      `SELECT COUNT(*)
       FROM cases
       WHERE client_id = $1
       AND next_hearing_date IS NOT NULL
       AND next_hearing_date >= CURRENT_DATE`,
      [clientId]
    );

    const closedResult = await pool.query(
      `SELECT COUNT(*)
       FROM cases
       WHERE client_id = $1
       AND status = 'CLOSED'`,
      [clientId]
    );

    res.json({
      ongoingCases: parseInt(ongoingResult.rows[0].count),
      upcomingHearings: parseInt(upcomingResult.rows[0].count),
      closedCases: parseInt(closedResult.rows[0].count),
      pendingPayments: 0,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// GET ALL CASES OF CLIENT
// ===============================
router.get("/cases/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    const result = await pool.query(
      `SELECT case_id, case_title, case_type, status, next_hearing_date, created_at
       FROM cases
       WHERE client_id = $1
       ORDER BY created_at DESC`,
      [clientId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching client cases:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// FILE NEW CASE REQUEST
// ===============================
router.post("/filecase", async (req, res) => {
  try {
    const { client_id, case_title, case_type, case_description } = req.body;

    if (!client_id || !case_title) {
      return res.status(400).json({
        message: "client_id and case_title are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO cases (client_id, case_title, case_type, case_description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [client_id, case_title, case_type, case_description]
    );

    res.status(201).json({
      message: "Case filed successfully",
      case: result.rows[0],
    });
  } catch (err) {
    console.error("Error filing case:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// UPLOAD DOCUMENT (CLIENT)
// ===============================
router.post("/upload-document", upload.single("file"), async (req, res) => {
  try {
    const { case_id, uploaded_by } = req.body;

    if (!case_id || !uploaded_by) {
      return res.status(400).json({
        message: "case_id and uploaded_by are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const result = await pool.query(
      `INSERT INTO documents (case_id, uploaded_by, file_name, file_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [case_id, uploaded_by, req.file.originalname, fileUrl]
    );

    res.status(201).json({
      message: "Document uploaded successfully",
      document: result.rows[0],
    });
  } catch (err) {
    console.error("Upload document error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// GET DOCUMENTS FOR A CASE
// ===============================
router.get("/documents/case/:caseId", async (req, res) => {
  try {
    const { caseId } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM documents
       WHERE case_id = $1
       ORDER BY uploaded_at DESC`,
      [caseId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Fetch documents error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// GET ALL DOCUMENTS OF A CLIENT
// ===============================
router.get("/documents/client/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    const result = await pool.query(
      `SELECT d.document_id, d.case_id, d.file_name, d.file_url, d.uploaded_at
       FROM documents d
       INNER JOIN cases c ON d.case_id = c.case_id
       WHERE c.client_id = $1
       ORDER BY d.uploaded_at DESC`,
      [clientId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Fetch client documents error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET CLIENT PROFILE
router.get("/settings/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    const result = await pool.query(
      `
      SELECT 
        u.user_id,
        u.full_name,
        u.email,
        cp.address,
        cp.dob,
        cp.gender
      FROM users u
      LEFT JOIN client_profiles cp ON u.user_id = cp.client_id
      WHERE u.user_id = $1
      `,
      [clientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Settings fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// UPDATE CLIENT PROFILE
router.put("/settings/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const { full_name, address, dob, gender } = req.body;

    // update users table
    await pool.query(
      `UPDATE users SET full_name = $1 WHERE user_id = $2`,
      [full_name, clientId]
    );

    // insert if profile doesn't exist, else update
    const profileResult = await pool.query(
      `
      INSERT INTO client_profiles (client_id, address, dob, gender)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (client_id)
      DO UPDATE SET address = EXCLUDED.address,
                    dob = EXCLUDED.dob,
                    gender = EXCLUDED.gender
      RETURNING *
      `,
      [clientId, address, dob, gender]
    );

    res.json({
      message: "Settings updated successfully",
      profile: profileResult.rows[0],
    });
  } catch (err) {
    console.error("Settings update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
