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
       AND status = 'ONGOING'`,
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
  `SELECT case_id, case_title, case_type, case_description, status, next_hearing_date, created_at
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

    /* LOG ACTIVITY */
    await pool.query(
      `INSERT INTO audit_logs (case_id, action, performed_by)
       VALUES ($1, $2, $3)`,
      [result.rows[0].case_id, 'Case Filed', clientId]
    );

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

      /* LOG ACTIVITY */
      await pool.query(
        `INSERT INTO audit_logs (case_id, action, performed_by)
         VALUES ($1, $2, $3)`,
        [case_id, 'Document Uploaded: ' + req.file.originalname, clientId]
      );

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
        u.account_status,  -- ✅ ADDED THIS
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


//delete documents
router.delete("/documents/:documentId", verifyToken, async (req, res) => {
  try {

    const documentId = parseInt(req.params.documentId);
    const clientId = req.user.user_id;

    const check = await pool.query(
      `
      SELECT d.document_id
      FROM documents d
      INNER JOIN cases c ON d.case_id = c.case_id
      WHERE d.document_id = $1 AND c.client_id = $2
      `,
      [documentId, clientId]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ message: "Access denied" });
    }

    await pool.query(
      `DELETE FROM documents WHERE document_id = $1`,
      [documentId]
    );

    res.json({ message: "Document deleted successfully" });

  } catch (err) {
    console.error("Delete document error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ongoing cases
router.get("/cases/ongoing", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `SELECT case_id, case_title, case_type, status
        FROM cases
        WHERE client_id = $1 AND status = 'ONGOING'`,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("ONGOING ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// closed cases
router.get("/cases/closed", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `SELECT case_id, case_title, case_type, status
       FROM cases
       WHERE client_id = $1 AND status = 'CLOSED'`,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("CLOSED ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET CLIENT ADVOCATES (FIXED VERSION)
router.get("/advocates", verifyToken, async (req, res) => {
  try {

    const clientId = req.user.user_id;

    const result = await pool.query(
      `
      SELECT 
        c.case_id,
        c.case_title,
        c.advocate_change_requested, 
        u.full_name AS advocate_name,
        ap.phone,
        ap.specialization,
        ap.experience_years
      FROM cases c
      LEFT JOIN users u ON c.advocate_id = u.user_id
      LEFT JOIN advocate_profiles ap ON u.user_id = ap.advocate_id
      WHERE c.client_id = $1
      AND c.advocate_id IS NOT NULL
      `,
      [clientId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("Error fetching advocates:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// CANCEL ADVOCATE CHANGE REQUEST
router.put("/cancel-advocate-change/:caseId", verifyToken, async (req, res) => {
  try {

    const userId = req.user.user_id;
    const caseId = parseInt(req.params.caseId);

    const check = await pool.query(
      `SELECT case_id FROM cases 
       WHERE case_id = $1 AND client_id = $2`,
      [caseId, userId]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ message: "Access denied" });
    }

    await pool.query(
      `UPDATE cases
       SET advocate_change_requested = FALSE
       WHERE case_id = $1`,
      [caseId]
    );

    res.json({ message: "Request cancelled successfully" });

  } catch (err) {
    console.error("Cancel request error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


//  REQUEST ACCOUNT CLOSURE
router.post("/request-closure", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    await pool.query(
      "UPDATE users SET account_status = 'PENDING_CLOSURE' WHERE user_id = $1",
      [userId]
    );

    res.json({ message: "Closure requested" });

  } catch (err) {
    console.error("Request closure error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//  CANCEL ACCOUNT CLOSURE
router.post("/cancel-closure", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    await pool.query(
      "UPDATE users SET account_status = 'ACTIVE' WHERE user_id = $1",
      [userId]
    );

    res.json({ message: "Closure cancelled" });

  } catch (err) {
    console.error("Cancel closure error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET UPCOMING HEARINGS
router.get("/cases/upcoming", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `
      SELECT case_id, case_title, next_hearing_date
      FROM cases
      WHERE client_id = $1
      AND next_hearing_date IS NOT NULL
      AND next_hearing_date >= CURRENT_DATE
      ORDER BY next_hearing_date ASC
      `,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("Upcoming hearings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//REQUEST ADVOCATE CHANGE
router.post("/request-advocate-change/:caseId", verifyToken, async (req, res) => {
  try {

    const userId = req.user.user_id; // ✅ FROM JWT
    const caseId = parseInt(req.params.caseId);

    // check ownership
    const check = await pool.query(
      `SELECT case_id FROM cases 
       WHERE case_id = $1 AND client_id = $2`,
      [caseId, userId]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ message: "Access denied" });
    }

    // update request flag
    await pool.query(
      `UPDATE cases
       SET advocate_change_requested = TRUE
       WHERE case_id = $1`,
      [caseId]
    );

    res.json({ message: "Advocate change request sent" });

  } catch (err) {
    console.error("Advocate change error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET CLIENT NOTIFICATIONS (NEWEST FIRST)
router.get("/notifications", verifyToken, async (req, res) => {
  try {

    const userId = req.user.user_id;

    const notifications = [];

    // 📄 DOCUMENT UPLOAD NOTIFICATIONS
    const docs = await pool.query(
      `SELECT d.case_id, d.uploaded_at
       FROM documents d
       INNER JOIN cases c ON d.case_id = c.case_id
       WHERE c.client_id = $1
       ORDER BY d.uploaded_at DESC`,
      [userId]
    );

    docs.rows.forEach(row => {
      notifications.push({
        message: `A document was uploaded for your case (#${row.case_id})`,
        date: row.uploaded_at
      });
    });

    // ⚖️ HEARING REMINDERS
    const hearings = await pool.query(
      `SELECT case_title, next_hearing_date
        FROM cases
        WHERE client_id = $1
        AND next_hearing_date BETWEEN NOW() AND NOW() + INTERVAL '3 days'`,
      [userId]
    );

    hearings.rows.forEach(row => {
      notifications.push({
        message: `Reminder: Hearing in 3 days for case '${row.case_title}'`,
        date: row.next_hearing_date
      });
    });

    // 🔥 SORT NEWEST FIRST
    notifications.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(notifications);

  } catch (err) {
    console.error("Notification error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// WITHDRAW CASE
router.put("/withdraw-case/:caseId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const caseId = req.params.caseId;

    // check ownership
    const check = await pool.query(
      "SELECT * FROM cases WHERE case_id = $1 AND client_id = $2",
      [caseId, userId]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ message: "Access denied" });
    }

    await pool.query(
      "UPDATE cases SET status = 'WITHDRAWN' WHERE case_id = $1",
      [caseId]
    );

    res.json({ message: "Case withdrawn successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// RESUBMIT CASE
router.put("/resubmit-case/:caseId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const caseId = req.params.caseId;

    const check = await pool.query(
      "SELECT * FROM cases WHERE case_id = $1 AND client_id = $2",
      [caseId, userId]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ message: "Access denied" });
    }

    await pool.query(
      "UPDATE cases SET status = 'PENDING' WHERE case_id = $1",
      [caseId]
    );

    res.json({ message: "Case resubmitted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
