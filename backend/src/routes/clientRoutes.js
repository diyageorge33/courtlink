const express = require("express");
const router = express.Router();
const pool = require("../db");

const multer = require("multer");
const path = require("path");
const { verifyToken } = require("../middleware/authMiddleware");


// MULTER CONFIG (LOCAL STORAGE)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// GET CLIENT DASHBOARD STATS

router.get("/dashboard/stats", verifyToken, async (req, res) => {
  try {
    const clientId = req.user.user_id; // from JWT

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


// GET ALL CASES OF CLIENT

router.get("/cases", verifyToken, async (req, res) => {
  try {
    const clientId = req.user.user_id;

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

// FILE NEW CASE REQUEST
router.post("/filecase", verifyToken, async (req, res) => {
  try {
    const clientId = req.user.user_id;
    const { case_title, case_type, case_description } = req.body;

    if (!case_title || case_title.trim() === "") {
      return res.status(400).json({
        message: "Case title is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO cases (client_id, case_title, case_type, case_description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [clientId, case_title, case_type, case_description]
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

// UPLOAD DOCUMENT (CLIENT)

router.post(
  "/upload-document",
  verifyToken,
  upload.single("file"),
  async (req, res) => {
    try {
      const clientId = req.user.user_id;
      const { case_id } = req.body;

      if (!case_id) {
        return res.status(400).json({
          message: "case_id is required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      // Verify that this case actually belongs to this client
      const caseCheck = await pool.query(
        `SELECT case_id FROM cases WHERE case_id = $1 AND client_id = $2`,
        [case_id, clientId]
      );

      if (caseCheck.rows.length === 0) {
        return res.status(403).json({
          message: "You are not allowed to upload documents for this case",
        });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      const result = await pool.query(
        `INSERT INTO documents (case_id, uploaded_by, file_name, file_url)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [case_id, clientId, req.file.originalname, fileUrl]
      );

      res.status(201).json({
        message: "Document uploaded successfully",
        document: result.rows[0],
      });

    } catch (err) {
      console.error("Upload document error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// GET DOCUMENTS FOR A CASE

router.get("/documents/case/:caseId", verifyToken, async (req, res) => {
  try {
    const caseId = parseInt(req.params.caseId);

    if (!caseId || isNaN(caseId)) {
      return res.status(400).json({ message: "Invalid case ID" });
    }

    const clientId = req.user.user_id;

    // Ensure case belongs to this client
    const caseCheck = await pool.query(
      `SELECT case_id FROM cases WHERE case_id = $1 AND client_id = $2`,
      [caseId, clientId]
    );

    if (caseCheck.rows.length === 0) {
      return res.status(403).json({ message: "Access denied" });
    }

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


// GET ALL DOCUMENTS OF A CLIENT

router.get("/documents/client", verifyToken, async (req, res) => {
  try {
    const clientId = req.user.user_id;

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
router.get("/settings", verifyToken, async (req, res) => {
  try {
    const clientId = req.user.user_id;

    const result = await pool.query(
      `
      SELECT 
        u.user_id,
        u.full_name,
        u.email,
        u.role,
        cp.address,
        cp.dob,
        cp.gender,
        cp.phone
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
router.put("/settings", verifyToken, async (req, res) => {
  try {
    const clientId = req.user.user_id;
    let { full_name, address, dob, gender, phone } = req.body;

    if (!full_name || full_name.trim() === "") {
      return res.status(400).json({ message: "Full name is required" });
    }

    if (!dob || dob === "") dob = null;
    if (!gender || gender === "") gender = null;
    if (!address || address === "") address = null;
    if (!phone || phone === "") phone = null;

    await pool.query(
      `UPDATE users SET full_name = $1 WHERE user_id = $2`,
      [full_name, clientId]
    );

    const profileResult = await pool.query(
      `
      INSERT INTO client_profiles (client_id, address, dob, gender, phone)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (client_id)
      DO UPDATE SET 
        address = EXCLUDED.address,
        dob = EXCLUDED.dob,
        gender = EXCLUDED.gender,
        phone = EXCLUDED.phone
      RETURNING *
      `,
      [clientId, address, dob, gender, phone]
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
