const pool = require("../db");
const axios = require("axios");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const transporter = require("../utils/mailer");
const jwt = require("jsonwebtoken");

/* LOGIN */
exports.login = async (req, res) => {
  const { email, password, captchaToken } = req.body;

  if (!captchaToken) {
    return res.status(400).json({ message: "Captcha is required" });
  }

  try {
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captchaToken}`;
    const captchaRes = await fetch(verifyUrl, { method: "POST" });
    const captchaVerify = {};
    captchaVerify.data = await captchaRes.json();

console.log("Captcha response:", captchaVerify.data);

if (!captchaVerify.data.success) {
  return res.status(403).json({ message: "Captcha verification failed" });
}

    // Fetch user by email
    const result = await pool.query(
      "SELECT user_id, full_name, role, password_hash, is_verified FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in"
    });
}

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Login success-generate jwt
      const token = jwt.sign(
      {
        user_id: user.user_id,   // using your original naming
        role: user.role
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.register = async (req, res) => {
  const {
    fullName,
    email,
    password,
    role,
    barEnrollmentNo,
    specialization,
    experienceYears
  } = req.body;

  try {
    const normalizedEmail = email.toLowerCase();


    // Check if email already exists
    const existingUser = await pool.query(
      "SELECT is_verified FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      if (!existingUser.rows[0].is_verified) {
        return res.status(400).json({
          message: "Email already registered but not verified"
        });
      }
      return res.status(400).json({ message: "Email already exists" });
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Insert user
    const userResult = await pool.query(
      `INSERT INTO users 
       (full_name, email, password_hash, role, otp, otp_expiry, is_verified)
       VALUES ($1,$2,$3,$4,$5,$6,false)
       RETURNING user_id`,
      [fullName, normalizedEmail, hashedPassword, role, otp, otpExpiry]
    );

    const userId = userResult.rows[0].user_id;

    //Insert advocate profile BEFORE OTP (if advocate)

    if (role === "ADVOCATE") {
      await pool.query(
        `INSERT INTO advocate_profiles
         (advocate_id, bar_enrollment_no, specialization, experience_years)
         VALUES ($1,$2,$3,$4)`,
        [
          userId,
          barEnrollmentNo,
          specialization,
          experienceYears
        ]
      );
    }

    //Send OTP email
    await transporter.sendMail({
      from: `"CourtLink Support" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Verify your CourtLink account",
      html: `
        <h3>Email Verification</h3>
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP expires in 10 minutes.</p>
      `,
    });

    res.status(201).json({
      message: "Registration successful. OTP sent to email."
    });

  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
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
    const user = await pool.query(
      `SELECT otp, otp_expiry FROM users WHERE email=$1`,
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      user.rows[0].otp !== otp ||
      new Date(user.rows[0].otp_expiry) < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await pool.query(
      `UPDATE users
       SET is_verified=true, otp=NULL, otp_expiry=NULL
       WHERE email=$1`,
      [email]
    );

    res.json({ message: "Account verified successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
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