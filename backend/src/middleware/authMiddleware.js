const jwt = require("jsonwebtoken");
const pool = require("../db");

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 FETCH USER STATUS FROM DB
    const result = await pool.query(
      "SELECT account_status FROM users WHERE user_id = $1",
      [decoded.user_id]
    );

    const user = result.rows[0];

    console.log("ACCOUNT STATUS:", user?.account_status); // 👈 DEBUG

    if (!user || user.account_status !== "ACTIVE") {
      return res.status(403).json({
        message: "Account is closed or inactive",
      });
    }

    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};