const { verifyToken } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const pool = require("../db");
const upload = require("../middleware/upload");
const path = require("path");
const fs = require("fs");

// GET Advocate Dashboard Stats
router.get("/dashboard/:id", verifyToken, async (req,res)=>{

  const advocateId = req.user.user_id;

  try {
    const totalCases = await pool.query(
      "SELECT COUNT(*) FROM cases WHERE advocate_id = $1",
      [advocateId]
    );

    const openCases = await pool.query(
      "SELECT COUNT(*) FROM cases WHERE advocate_id = $1 AND status = 'ONGOING'",
      [advocateId]
    );

    const weeklyCases = await pool.query(
      "SELECT COUNT(*) FROM cases WHERE advocate_id = $1 AND created_at >= NOW() - INTERVAL '7 days'",
      [advocateId]
    );

    const clients = await pool.query(
      "SELECT COUNT(DISTINCT client_id) FROM cases WHERE advocate_id = $1",
      [advocateId]
    );

    res.json({
      totalCases: totalCases.rows[0].count,
      openCases: openCases.rows[0].count,
      weeklyCases: weeklyCases.rows[0].count,
      clients: clients.rows[0].count,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET All/Filtered Cases for Advocate
router.get("/cases/:id", verifyToken, async (req, res) => {
  const advocateId = req.user.user_id;
  const { status, period } = req.query;

  try {
    let query = "SELECT * FROM cases WHERE advocate_id = $1";
    const params = [advocateId];

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    if (period === "week") {
      query += " AND created_at >= NOW() - INTERVAL '7 days'";
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/clients", verifyToken, async (req, res) => {
  try {
    const advocateId = req.user.user_id;

    console.log("CLIENT ROUTE HIT. Advocate ID:", advocateId);

    const result = await pool.query(
      `
      SELECT DISTINCT u.user_id, u.full_name, u.email
      FROM users u
      JOIN cases c ON u.user_id = c.client_id
      WHERE c.advocate_id = $1
      `,
      [advocateId]
    );

    console.log("CLIENT QUERY RESULT:", result.rows);

    res.json(result.rows);

  } catch (err) {

    console.error("CLIENT FETCH ERROR:", err);

    res.status(500).json({ error: "Server error" });
  }
});

router.get("/case/:id", verifyToken, async (req, res) => {

  const caseId = req.params.id;

  try {

    const result = await pool.query(
      "SELECT * FROM cases WHERE case_id = $1",
      [caseId]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Server error" });

  }

});

router.post("/add-case", verifyToken, async (req,res)=>{
  const {
    client_id,
    advocate_id,
    case_title,
    case_type,
    case_description,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO cases
      (client_id, advocate_id, case_title, case_type, case_description, status, created_at)
      VALUES ($1,$2,$3,$4,$5,'PENDING',NOW())
      RETURNING *`,
      [client_id, advocate_id, case_title, case_type, case_description]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/delete-case/:id", verifyToken, async (req,res)=>{
  const caseId = req.params.id;

  try {
    await pool.query(
      "DELETE FROM cases WHERE case_id = $1",
      [caseId]
    );

    res.json({ message: "Case deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/schedule-hearing/:id", verifyToken, async (req,res)=>{
  const caseId = req.params.id;
  const { hearing_date } = req.body;

  try {
    const result = await pool.query(
      "UPDATE cases SET next_hearing_date = $1 WHERE case_id = $2 RETURNING *",
      [hearing_date, caseId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET Advocate Schedules
router.get("/schedules", verifyToken, async (req, res) => {
  const advocateId = req.user.user_id;
  try {
    const result = await pool.query(
      "SELECT * FROM advocate_schedules WHERE advocate_id = $1 ORDER BY date ASC",
      [advocateId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST Add Advocate Schedule
router.post("/schedules", verifyToken, async (req, res) => {
  const advocateId = req.user.user_id;
  const { date, reason, slot } = req.body;

  try {
    // Check existing schedules for the given date
    const checkQuery = await pool.query(
      "SELECT * FROM advocate_schedules WHERE advocate_id = $1 AND date = $2",
      [advocateId, date]
    );
    const existingObj = checkQuery.rows;

    if (existingObj.length >= 2) {
      return res.status(400).json({ message: "Maximum 2 slots per day allowed." });
    }

    if (existingObj.length > 0) {
      const existing = existingObj[0];
      if (existing.slot === "WHOLE_DAY" || slot === "WHOLE_DAY") {
        return res.status(400).json({ message: "Cannot mix WHOLE DAY with other slots on the same date." });
      }
      if (existingObj.some(s => s.slot === slot)) {
        return res.status(400).json({ message: `Slot ${slot} is already booked on this date.` });
      }
    }

    const result = await pool.query(
      "INSERT INTO advocate_schedules (advocate_id, date, reason, slot) VALUES ($1, $2, $3, $4) RETURNING *",
      [advocateId, date, reason, slot || 'WHOLE_DAY']
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE Advocate Schedule
router.delete("/schedules/:id", verifyToken, async (req, res) => {
  const scheduleId = req.params.id;
  const advocateId = req.user.user_id;

  try {
    await pool.query(
      "DELETE FROM advocate_schedules WHERE schedule_id = $1 AND advocate_id = $2",
      [scheduleId, advocateId]
    );
    res.json({ message: "Schedule deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// =======================
// RESIGNATION ROUTES
// =======================

// POST /api/advocate/resignation
router.post("/resignation", verifyToken, async (req, res) => {
  const advocateId = req.user.user_id;
  const { reason } = req.body;

  try {
    const checkExisting = await pool.query(
      "SELECT * FROM advocate_resignations WHERE advocate_id = $1 AND status = 'PENDING'",
      [advocateId]
    );

    if (checkExisting.rows.length > 0) {
      return res.status(400).json({ message: "You already have a pending resignation request." });
    }

    const result = await pool.query(
      "INSERT INTO advocate_resignations (advocate_id, reason) VALUES ($1, $2) RETURNING *",
      [advocateId, reason]
    );

    res.json({ message: "Resignation request submitted successfully.", request: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/advocate/resignation/status
router.get("/resignation/status", verifyToken, async (req, res) => {
  const advocateId = req.user.user_id;

  try {
    const checkExisting = await pool.query(
      "SELECT * FROM advocate_resignations WHERE advocate_id = $1 AND status = 'PENDING'",
      [advocateId]
    );

    res.json({ hasPendingRequest: checkExisting.rows.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/advocate/resignation
router.delete("/resignation", verifyToken, async (req, res) => {
  const advocateId = req.user.user_id;

  try {
    const result = await pool.query(
      "DELETE FROM advocate_resignations WHERE advocate_id = $1 AND status = 'PENDING' RETURNING *",
      [advocateId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No pending resignation request found to cancel." });
    }

    res.json({ message: "Resignation request cancelled successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==============================
// UPLOAD PROFILE PHOTO
// ==============================

router.post(
  "/upload-profile",
  verifyToken,
  upload.single("photo"),
  async (req, res) => {
    const advocateId = req.user.user_id;

    if (!req.file) {
      return res.status(400).json({ message: "No valid image uploaded" });
    }

    const newFile = req.file.filename;

    try {
      // Get old image from DB
      const oldData = await pool.query(
        "SELECT profile_image FROM advocate_profiles WHERE advocate_id = $1",
        [advocateId]
      );

      const oldImage = oldData.rows[0]?.profile_image;

      // Delete old image from uploads folder
      if (oldImage) {
        const oldPath = path.join(__dirname, "../../uploads", oldImage);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Update DB with new image
      await pool.query(
        "UPDATE advocate_profiles SET profile_image = $1 WHERE advocate_id = $2",
        [newFile, advocateId]
      );

      res.json({
        message: "Profile photo uploaded successfully",
        filePath: newFile,
      });

    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

// ==============================
// GET PROFILE DATA
// ==============================

router.get("/profile", verifyToken, async (req, res) => {
  const advocateId = req.user.user_id;

  try {
    const result = await pool.query(
      `
      SELECT 
        u.full_name,
        u.email,
        ap.profile_image,
        ap.specialization,
        ap.experience_years,
        ap.fee_per_hour
      FROM users u
      JOIN advocate_profiles ap 
        ON u.user_id = ap.advocate_id
      WHERE u.user_id = $1
      `,
      [advocateId]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==============================
// GET ALL ADVOCATES (FOR CLIENT VIEW)
// ==============================

router.get("/all", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.user_id AS advocate_id,
        u.full_name,
        ap.specialization,
        ap.experience_years AS experience,
        ap.profile_image,
        COALESCE(ap.fee_per_hour, 500) AS fee_per_hour
      FROM users u
      LEFT JOIN advocate_profiles ap 
        ON u.user_id = ap.advocate_id
      WHERE u.role = 'ADVOCATE'
    `);

    res.json(result.rows);

  } catch (err) {
    console.error("FETCH ADVOCATES ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==============================
// UPDATE ADVOCATE PROFILE
// ==============================

router.put("/profile", verifyToken, async (req, res) => {
  const advocateId = req.user.user_id;

  const { specialization, experience_years, fee_per_hour } = req.body;

  try {
    await pool.query(
      `
      UPDATE advocate_profiles
      SET 
        specialization = $1,
        experience_years = $2,
        fee_per_hour = $3
      WHERE advocate_id = $4
      `,
      [specialization, experience_years, fee_per_hour, advocateId]
    );

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

// ==============================
// GET BOOKINGS FOR ADVOCATE
// ==============================
router.get("/bookings", verifyToken, async (req, res) => {
  const advocateId = req.user.user_id;

  try {
    const result = await pool.query(
      `
      SELECT 
        name,
        email,
        phone,
        preferred_date,
        amount,
        payment_id,
        created_at,
        advocate_name
      FROM bookings
      WHERE advocate_id = $1
      ORDER BY created_at DESC
      `,
      [advocateId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("FETCH BOOKINGS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;



