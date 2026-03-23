const app = require("./app");

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();
const pool = require("./db");
const { ensureAuditLogsTable } = require("./utils/auditLogs");
const cookieParser = require("cookie-parser");

// Routes
const authRoutes = require("./routes/auth.routes");
const aiRoutes = require("./routes/ai.routes");
const clientRoutes = require("./routes/clientRoutes");
const advocateRoutes = require("./routes/advocate.routes");
const orderRoutes = require("./routes/order.routes");

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/client", clientRoutes);
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/auth", authRoutes);
app.use("/api/payment", require("./routes/payment.routes"));
app.use("/api/ai", aiRoutes);
app.use("/api/advocate", advocateRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bookings", require("./routes/booking.routes"));

// IMPORTANT (DO NOT CHANGE AGAIN)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("CourtLink backend running");
});

// DB check
pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("DB connection failed", err);
  } else {
    console.log("DB connected at:", result.rows[0].now);
  }
});

ensureAuditLogsTable()
  .then(() => console.log("audit_logs table ready"))
  .catch((err) => console.error("Failed to initialize audit_logs table", err));

// Start server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
