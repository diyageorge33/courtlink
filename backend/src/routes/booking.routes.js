const express = require("express");
const router = express.Router();
const pool = require("../db");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid"); 

//  Mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


//  BOOK APPOINTMENT

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
    //  GET OR CREATE guest_id
    let guestId = req.cookies?.guest_id;

    if (!guestId) {
      guestId = uuidv4();

      res.cookie("guest_id", guestId, {
        httpOnly: true,
        secure: false, // change to true in production (HTTPS)
        maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
      });
    }

    //  Prevent duplicate ONLY for future bookings (USING guest_id)
    const existing = await pool.query(
      `SELECT * FROM bookings
       WHERE advocate_id = $1 
       AND guest_id = $2
       AND preferred_date >= CURRENT_DATE`,
      [advocate_id, guestId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "You already have an active booking with this advocate",
      });
    }

    //  Get advocate name
    const advocate = await pool.query(
      `SELECT full_name FROM users WHERE user_id = $1`,
      [advocate_id]
    );

    const advocateName = advocate.rows[0]?.full_name || "Advocate";

    // Save booking (WITH guest_id)
    const result = await pool.query(
      `INSERT INTO bookings
      (name, email, phone, preferred_date, advocate_id, payment_id, amount, guest_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [name, email, phone, preferred_date, advocate_id, payment_id, amount, guestId]
    );

    //  Notify advocate
    await pool.query(
      `INSERT INTO notifications (user_id, message)
       VALUES ($1, $2)`,
      [
        advocate_id,
        `New appointment booked by ${name} on ${preferred_date}`,
      ]
    );

    //  Send Email
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

    res.json({
      message: "Booking successful & email sent",
      booking: result.rows[0],
    });

  } catch (err) {
    console.error("BOOKING ERROR:", err);
    res.status(500).json({ error: "Booking failed" });
  }
});


//  GET ADVOCATE BOOKINGS

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

    res.json(result.rows);

  } catch (err) {
    console.error("FETCH BOOKINGS ERROR:", err);
    res.status(500).json({ error: "Error fetching bookings" });
  }
});


//  CHECK BOOKING (USING guest_id)

router.get("/check", async (req, res) => {
  try {
    const { advocate_id } = req.query;

    //  DEBUG (keep for now)
    console.log("COOKIES:", req.cookies);

    const guestId = req.cookies?.guest_id;

    //  If no cookie → no booking
    if (!guestId) {
      return res.json(null);
    }

    //  Find booking
    const result = await pool.query(
      `SELECT preferred_date FROM bookings
       WHERE advocate_id = $1 
       AND guest_id = $2
       AND preferred_date >= CURRENT_DATE`,
      [advocate_id, guestId]
    );

    //  ALWAYS send response
    if (result.rows.length > 0) {
      return res.json(result.rows[0]);
    } else {
      return res.json(null);
    }

  } catch (err) {
    console.error("CHECK BOOKING ERROR:", err);
    res.status(500).json({ error: "Error checking booking" });
  }
});

module.exports = router;