const express = require("express");
const router = express.Router();
const pool = require("../db");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

// Mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ============================
// BOOK APPOINTMENT
// ============================
router.post("/", async (req, res) => {
  const {
    name,
    email,
    phone,
    preferred_date,
    advocate_id,
    payment_id,
    amount,
  } = req.body;

  try {
    // ✅ REQUIRED FIELD VALIDATION
    if (!name || !email || !phone || !preferred_date || !advocate_id) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // ✅ PREVENT PAST DATE BOOKING
    const today = new Date();
    const selectedDate = new Date(preferred_date);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        error: "Cannot book for past dates",
      });
    }

    // ✅ GET OR CREATE guest_id
    let guestId = req.cookies?.guest_id;

    if (!guestId) {
      guestId = uuidv4();

      res.cookie("guest_id", guestId, {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
    }

    // ✅ PREVENT DUPLICATE (SAME DATE ONLY)
    const existing = await pool.query(
      `SELECT * FROM bookings
       WHERE advocate_id = $1 
       AND guest_id = $2
       AND preferred_date = $3`,
      [advocate_id, guestId, preferred_date]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "You already have a booking for this date with this advocate",
      });
    }

    // ✅ GET ADVOCATE NAME
    const advocate = await pool.query(
      `SELECT full_name FROM users WHERE user_id = $1`,
      [advocate_id]
    );

    const advocateName = advocate.rows[0]?.full_name || "Advocate";

    // ✅ SAVE BOOKING
    const result = await pool.query(
      `INSERT INTO bookings
      (name, email, phone, preferred_date, advocate_id, payment_id, amount, guest_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        name,
        email,
        phone,
        preferred_date,
        advocate_id,
        payment_id,
        amount,
        guestId,
      ]
    );

    // ✅ NOTIFICATION
    if (advocate_id) {
      await pool.query(
        `INSERT INTO notifications (user_id, message)
         VALUES ($1, $2)`,
        [
          advocate_id,
          `New appointment booked by ${name} on ${preferred_date}`,
        ]
      );
    }

    // ✅ EMAIL (optional)
    if (process.env.NODE_ENV !== "test" && email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Appointment Confirmation - CourtLink",
        html: `
          <h2>Appointment Confirmed ✅</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Advocate:</strong> ${advocateName}</p>
          <p><strong>Date:</strong> ${preferred_date}</p>
          <p><strong>Amount Paid:</strong> ₹${amount}</p>
          <p><strong>Payment ID:</strong> ${payment_id}</p>
        `,
      });
    }

    res.json({
      message: "Booking successful",
      booking: result.rows[0],
    });

  } catch (err) {
    console.error("BOOKING ERROR:", err);
    res.status(500).json({ error: "Booking failed" });
  }
});

// ============================
// GET ADVOCATE BOOKINGS
// ============================
router.get("/advocate/:id", async (req, res) => {
  try {
    const advocateId = req.params.id;

    const result = await pool.query(
      `SELECT 
        booking_id,
        name,
        email,
        phone,
        preferred_date,
        created_at
      FROM bookings
      WHERE advocate_id = $1
      ORDER BY preferred_date DESC`,
      [advocateId]
    );

    res.status(200).json(result.rows);

  } catch (err) {
    console.error("FETCH BOOKINGS ERROR:", err);
    res.status(500).json({ error: "Error fetching bookings" });
  }
});

// ============================
// CHECK BOOKING
// ============================
router.get("/check", async (req, res) => {
  try {
    const { advocate_id } = req.query;
    const guestId = req.cookies?.guest_id;

    if (!guestId) {
      return res.json(null);
    }

    const result = await pool.query(
      `SELECT preferred_date FROM bookings
       WHERE advocate_id = $1 
       AND guest_id = $2
       AND preferred_date >= CURRENT_DATE`,
      [advocate_id, guestId]
    );

    return res.json(result.rows[0] || null);

  } catch (err) {
    console.error("CHECK BOOKING ERROR:", err);
    res.status(500).json({ error: "Error checking booking" });
  }
});

module.exports = router;