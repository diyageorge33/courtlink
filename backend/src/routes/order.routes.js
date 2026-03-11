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

module.exports = router;