const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET Advocate Dashboard Stats
router.get("/dashboard/:id", async (req, res) => {
  const advocateId = req.params.id;

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

// GET All Cases for Advocate
router.get("/cases/:id", async (req, res) => {
  const advocateId = req.params.id;

  try {
    const result = await pool.query(
      "SELECT * FROM cases WHERE advocate_id = $1 ORDER BY created_at DESC",
      [advocateId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
