const pool = require("../db");
const axios = require("axios");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const transporter = require("../utils/mailer");
const jwt = require("jsonwebtoken");

/* LOGIN */
exports.login = async (req, res) => {
  console.log("LOGIN API HIT");
  console.log("Request body:", req.body);

  const { email, password, captchaToken } = req.body;

  if (!email || !password || !captchaToken) {
    console.log("Missing fields:", { email: !!email, password: !!password, captcha: !!captchaToken });
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    //  CAPTCHA VERIFY
    const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    const captchaRes = await axios.post(
      verifyUrl,
      new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET,
        response: captchaToken,
      })
    );

    const captchaData = captchaRes.data;
    console.log("Captcha response:", captchaData);

    if (!captchaData.success) {
      return res.status(403).json({ message: "Captcha verification failed" });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    //  CHECK USERS TABLE FIRST
    const result = await pool.query(
      "SELECT user_id, role, full_name, password_hash, is_verified, account_status FROM users WHERE email = $1",
      [normalizedEmail]
    );

    console.log("User fetched:", result.rows[0]);

    //  IF NOT FOUND IN USERS → CHECK PENDING
    if (result.rows.length === 0) {

      const pending = await pool.query(
        "SELECT is_verified, status FROM pending_advocates WHERE email = $1",
        [normalizedEmail]
      );

      if (pending.rows.length > 0) {

        const user = pending.rows[0];

        //  VERY IMPORTANT: CHECK REJECTED FIRST
        if (user.status === "REJECTED") {
          return res.status(403).json({
            message: "Your request was denied by admin"
          });
        }

        //  NOT VERIFIED
        if (!user.is_verified) {
          return res.status(403).json({
            message: "Please verify your email first"
          });
        }

        //  STILL PENDING
        return res.status(403).json({
          message: "Your account is pending admin approval"
        });
      }

      //  NOT FOUND ANYWHERE
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    //  BLOCK REJECTED USERS (from users table)
    if (user.account_status === "REJECTED") {
      return res.status(403).json({
        message: "Your registration was rejected by admin"
      });
    }

    //  BLOCK PENDING USERS (if you use this)
    if (user.account_status === "PENDING") {
      return res.status(403).json({
        message: "Your account is under admin review"
      });
    }

    //  VERIFY EMAIL
    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in"
      });
    }

    //  PASSWORD CHECK
    console.log("Entered password:", password);
    console.log("Stored hash:", user.password_hash);

    const isMatch = await bcrypt.compare(password, user.password_hash);

    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //  GENERATE TOKEN
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        full_name: user.full_name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      role: user.role,
      full_name: user.full_name
    });

  } catch (err) {
    console.error("LOGIN CRITICAL ERROR:", err);
    res.status(500).json({
      message: "An internal server error occurred during login. Please contact support.",
      error: err.message
    });
  }
};

/* GET PENDING ADVOCATES */
exports.getPendingAdvocates = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, office_id, specialization, experience_years
       FROM pending_advocates
       WHERE is_verified = true
       AND status = 'PENDING'
       ORDER BY created_at DESC`
    );

    res.json(result.rows);

  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: "Error fetching pending advocates" });
  }
};

/* REJECT ADVOCATE */
exports.rejectAdvocate = async (req, res) => {
  const { id } = req.body;

  try {
    console.log(" Reject request received for ID:", id);

    const check = await pool.query(
      "SELECT id, status FROM pending_advocates WHERE id = $1",
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        message: "Advocate not found"
      });
    }

    const update = await pool.query(
      `UPDATE pending_advocates
       SET status = 'REJECTED'
       WHERE id = $1
       RETURNING id, status`,
      [id]
    );

    console.log(" Updated:", update.rows);

    res.json({
      message: "Advocate rejected successfully"
    });

  } catch (err) {
    console.error(" REJECT ERROR:", err);
    res.status(500).json({
      message: "Error rejecting advocate"
    });
  }
};

/* REJECT ADVOCATE */
exports.rejectAdvocate = async (req, res) => {
  const { id } = req.body;

  try {
    console.log(" Reject request received for ID:", id);

    //  check if record exists
    const check = await pool.query(
      "SELECT id, status FROM pending_advocates WHERE id = $1",
      [id]
    );

    console.log(" DB check result:", check.rows);

    if (check.rows.length === 0) {
      return res.status(404).json({
        message: "Advocate not found (ID mismatch)"
      });
    }

    //  update status
    const update = await pool.query(
      `UPDATE pending_advocates
       SET status = 'REJECTED'
       WHERE id = $1
       RETURNING id, status`,
      [id]
    );

    console.log(" Update result:", update.rows);

    res.json({
      message: "Advocate rejected successfully",
      updated: update.rows
    });

  } catch (err) {
    console.error(" REJECT ERROR:", err);
    res.status(500).json({
      message: "Error rejecting advocate",
      error: err.message
    });
  }
};

/* APPROVE ADVOCATE */
exports.approveAdvocate = async (req, res) => {
  const { id } = req.body;

  try {
    //  get pending advocate
    const result = await pool.query(
      "SELECT * FROM pending_advocates WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    const adv = result.rows[0];

    //  insert into users
    const userRes = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, is_verified)
       VALUES ($1,$2,$3,'ADVOCATE',true)
       RETURNING user_id`,
      [adv.full_name, adv.email, adv.password_hash]
    );

    const userId = userRes.rows[0].user_id;

    //  insert into advocate_profiles
    await pool.query(
      `INSERT INTO advocate_profiles
       (advocate_id, office_id, specialization, experience_years)
       VALUES ($1,$2,$3,$4)`,
      [
        userId,
        adv.office_id,
        adv.specialization,
        adv.experience_years
      ]
    );

    //  delete from pending after approval
    await pool.query(
      "DELETE FROM pending_advocates WHERE id = $1",
      [id]
    );

    res.json({ message: "Advocate approved successfully" });

  } catch (err) {
    console.error("APPROVE ERROR:", err);
    res.status(500).json({ message: "Error approving advocate" });
  }
};

/* REGISTER */
exports.register = async (req, res) => {
  const {
    fullName,
    email,
    password,
    confirmPassword,
    role,
    phone,
    dob,
    officeId,
    specialization,
    experienceYears
  } = req.body;

  // ✅ basic validation
  if (!fullName || !email || !password || !confirmPassword || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    // 🔥 CHECK BOTH TABLES (IMPORTANT FIX)
    const existingUser = await pool.query(
      "SELECT user_id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    const existingPending = await pool.query(
      "SELECT id FROM pending_advocates WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0 || existingPending.rows.length > 0) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // ================= CLIENT =================
    if (role === "CLIENT") {

      if (!phone || !dob) {
        return res.status(400).json({
          message: "Phone and Date of Birth are required"
        });
      }

      const userRes = await pool.query(
        `INSERT INTO users
         (full_name, email, password_hash, role, otp, otp_expiry, is_verified)
         VALUES ($1,$2,$3,'CLIENT',$4,$5,false)
         RETURNING user_id`,
        [fullName, normalizedEmail, hashedPassword, otp, otpExpiry]
      );

      const userId = userRes.rows[0].user_id;

      await pool.query(
        `INSERT INTO client_profiles (client_id, phone, dob)
         VALUES ($1,$2,$3)`,
        [userId, phone, dob]
      );

      await transporter.sendMail({
        to: normalizedEmail,
        subject: "Verify your account",
        html: `<h2>${otp}</h2>`
      });

      return res.json({ message: "OTP sent to email" });
    }

    // ================= ADVOCATE =================
    if (role === "ADVOCATE") {

      if (!phone || !officeId || !specialization || !experienceYears) {
        return res.status(400).json({
          message: "All advocate fields are required"
        });
      }

      await pool.query(
        `INSERT INTO pending_advocates
         (full_name, email, password_hash, phone, office_id, specialization, experience_years, otp, otp_expiry, is_verified)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,false)`,
        [
          fullName,
          normalizedEmail,
          hashedPassword,
          phone,
          officeId,
          specialization,
          experienceYears,
          otp,
          otpExpiry
        ]
      );

      await transporter.sendMail({
        to: normalizedEmail,
        subject: "Verify your account",
        html: `<h2>${otp}</h2>`
      });

      return res.json({ message: "OTP sent" });
    }

    return res.status(400).json({ message: "Invalid role" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* FORGOT PASSWORD*/
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await pool.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await pool.query(
      "UPDATE users SET reset_token=$1, reset_token_expiry=$2 WHERE email=$3",
      [token, expiry, email]
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: `"CourtLink Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your CourtLink password",
      html: `
        <p>You requested a password reset.</p>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    res.json({ message: "Password reset link sent to email" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/*RESET PASSWORD*/
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await pool.query(
      `SELECT user_id FROM users
       WHERE reset_token=$1 AND reset_token_expiry > NOW()`,
      [token]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users
       SET password_hash=$1,
           reset_token=NULL,
           reset_token_expiry=NULL
       WHERE reset_token=$2`,
      [hashedPassword, token]
    );

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/*VERIFY OTP */
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check USERS (for CLIENT)
    let result = await pool.query(
      "SELECT otp, otp_expiry FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];

      if (
        user.otp !== otp ||
        new Date(user.otp_expiry) < new Date()
      ) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      await pool.query(
        `UPDATE users
         SET is_verified = true, otp=NULL, otp_expiry=NULL
         WHERE email=$1`,
        [normalizedEmail]
      );

      return res.json({ message: "Email verified successfully" });
    }

    // 2. Check PENDING ADVOCATES
    result = await pool.query(
      "SELECT otp, otp_expiry FROM pending_advocates WHERE email = $1",
      [normalizedEmail]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];

      if (
        user.otp !== otp ||
        new Date(user.otp_expiry) < new Date()
      ) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      await pool.query(
        `UPDATE pending_advocates
         SET is_verified = true, otp=NULL, otp_expiry=NULL
         WHERE email=$1`,
        [normalizedEmail]
      );

      return res.json({ message: "Verified. Waiting for admin approval" });
    }

    return res.status(404).json({ message: "User not found" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

/*RESEND OTP */
exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await pool.query(
      `SELECT user_id FROM users 
       WHERE email=$1 AND is_verified=false`,
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "User already verified or does not exist",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `UPDATE users 
       SET otp=$1, otp_expiry=$2 
       WHERE email=$3`,
      [otp, otpExpiry, email]
    );

    await transporter.sendMail({
      from: `"CourtLink Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your new OTP",
      html: `
        <h3>Your new OTP</h3>
        <h2>${otp}</h2>
        <p>Valid for 10 minutes.</p>
      `,
    });

    res.json({ message: "OTP resent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};