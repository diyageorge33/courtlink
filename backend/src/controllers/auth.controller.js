const pool = require("../db");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT user_id, role FROM users WHERE email = $1 AND password_hash = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.register = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  try {
    await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)`,
      [fullName, email, password, role]
    );

    res.json({ message: "Registration successful" });
  } catch (err) {
    if (err.code === "23505") {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};
