const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const pool = require("./db");

const authRoutes = require("./routes/auth.routes");
const aiRoutes = require("./routes/ai.routes");
const clientRoutes = require("./routes/clientRoutes");



app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/client", clientRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/payment", require("./routes/payment.routes"));
app.use("/api/ai", aiRoutes);
app.use("/uploads", express.static("src/uploads"));



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
