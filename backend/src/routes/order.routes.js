const express = require("express");
const router = express.Router();
const multer = require("multer");
const { verifyToken } = require("../middleware/authMiddleware");
const pool = require("../db");

const storage = multer.diskStorage({
  destination: "uploads/orders",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/upload", verifyToken, upload.single("order"), async (req,res)=>{

  const advocateId = req.user.user_id;
  const { case_id } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO orders (case_id, advocate_id, file_name)
       VALUES ($1,$2,$3) RETURNING *`,
      [case_id, advocateId, req.file.filename]
    );

    res.json(result.rows[0]);

  } catch(err) {

    console.error(err);
    res.status(500).json({error:"Server error"});

  }

});

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
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

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
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;