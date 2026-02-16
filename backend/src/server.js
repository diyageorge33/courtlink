const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const pool = require("./db");

const authRoutes = require("./routes/auth.routes");
const aiRoutes = require("./routes/ai.routes");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("CourtLink backend running");
});

const PORT = 5000;

pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("DB connection failed", err);
  } else {
    console.log("DB connected at:", result.rows[0].now);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
