const express = require("express");
const cors = require("cors");
require("dotenv").config();


const app = express();
const pool = require("./db");
const authRoutes = require("./routes/auth.routes");


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("CourtLink backend running");
});

const PORT = 5000;
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("DB connection failed", err);
  } else {
    console.log("DB connected at:", res.rows[0].now);
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
