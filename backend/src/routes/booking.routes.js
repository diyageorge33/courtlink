const express = require("express");
const router = express.Router();
const pool = require("../db");
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  const {
    name,
    email,
    phone,
    preferred_date,
    advocate_id,
    advocate_name,
    payment_id,
    amount,
  } = req.body;

  try {
    // 1️⃣ Save in DB
    await pool.query(
      `
      INSERT INTO bookings
      (name, email, phone, preferred_date, advocate_id, advocate_name, payment_id, amount)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [name, email, phone, preferred_date, advocate_id, advocate_name, payment_id, amount]
    );

    // 2️⃣ Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Appointment Confirmation - CourtLink",
      html: `
        <h2>Appointment Confirmed ✅</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Advocate:</strong> ${advocate_name}</p>
        <p><strong>Date:</strong> ${preferred_date}</p>
        <p><strong>Amount Paid:</strong> ₹${amount}</p>
        <p><strong>Payment ID:</strong> ${payment_id}</p>
      `,
    });

    res.json({ message: "Booking successful & email sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Booking failed" });
  }
});

module.exports = router;