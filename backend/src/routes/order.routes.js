const express = require("express");
const router = express.Router();
const multer = require("multer");
const { verifyToken } = require("../middleware/authMiddleware");
const pool = require("../db");

// Multer config
const storage = multer.diskStorage({
  destination: "uploads/orders",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// ================== UPLOAD ORDER ==================
router.post("/upload", verifyToken, upload.single("order"), async (req, res) => {
  const advocateId = req.user.user_id;
  const { case_id } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = "uploads/orders/" + req.file.filename;

    //  Insert order
    const result = await pool.query(
      `INSERT INTO orders (case_id, advocate_id, file_name, file_url)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [case_id, advocateId, req.file.filename, filePath]
    );

    //  Get client_id of that case
    const caseResult = await pool.query(
      `SELECT client_id FROM cases WHERE case_id = $1`,
      [case_id]
    );

    const clientId = caseResult.rows[0].client_id;

    // Insert notification
    await pool.query(
      `INSERT INTO notifications (user_id, message)
       VALUES ($1, $2)`,
      [clientId, "Your advocate has uploaded a new order."]
    );

    // 4️⃣ Send response
    res.json(result.rows[0]);

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ================== ADVOCATE ORDERS ==================
router.get("/my-orders", verifyToken, async (req, res) => {
  const advocateId = req.user.user_id;

  try {
    const result = await pool.query(
      `SELECT o.*, c.case_title 
       FROM orders o
       JOIN cases c ON o.case_id = c.case_id
       WHERE o.advocate_id = $1
       ORDER BY o.uploaded_at DESC`,
      [advocateId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("MY ORDERS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ================== DELETE ORDER ==================
router.delete("/delete/:id", verifyToken, async (req, res) => {
  const advocateId = req.user.user_id;
  const orderId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM orders WHERE order_id = $1 AND advocate_id = $2 RETURNING *",
      [orderId, advocateId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found or unauthorized" });
    }

    res.json({ message: "Order deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ================== CLIENT VIEW ORDERS (PAGINATION) ==================
router.get("/client-orders", verifyToken, async (req, res) => {
  try {

    const clientId = req.user.user_id;

    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // you can change (5,10, etc)
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT 
        o.order_id,
        o.file_name,
        o.file_url,
        o.uploaded_at,
        c.case_title
       FROM orders o
       JOIN cases c ON o.case_id = c.case_id
       WHERE c.client_id = $1
       ORDER BY o.uploaded_at DESC
       LIMIT $2 OFFSET $3`,
      [clientId, limit, offset]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("CLIENT ORDERS ERROR:", err);
    res.status(500).json({ message: "Error fetching client orders" });
  }
});

module.exports = router;