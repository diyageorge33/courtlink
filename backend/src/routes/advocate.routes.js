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

router.get("/dashboard/:id", async (req, res) => {

  const advocateId = req.params.id;

  try {

    const totalCases = await pool.query(
      "SELECT COUNT(*) FROM cases WHERE advocate_id = $1",
      [advocateId]
    );

    const ongoingCases = await pool.query(
      "SELECT COUNT(*) FROM cases WHERE advocate_id = $1 AND status = 'ONGOING'",
      [advocateId]
    );

    const weeklyCases = await pool.query(
      `SELECT COUNT(*) FROM cases
       WHERE advocate_id = $1
       AND created_at >= NOW() - INTERVAL '7 days'`,
      [advocateId]
    );

    const clients = await pool.query(
      "SELECT COUNT(DISTINCT client_id) FROM cases WHERE advocate_id = $1",
      [advocateId]
    );

    res.json({
      totalCases: totalCases.rows[0].count,
      ongoingCases: ongoingCases.rows[0].count,
      weeklyCases: weeklyCases.rows[0].count,
      clients: clients.rows[0].count
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Server error" });

  }

});

router.post("/add-case", async (req, res) => {
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

router.delete("/delete-case/:id", async (req, res) => {
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

router.put("/schedule-hearing/:id", async (req, res) => {
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

module.exports = router;
