const razorpay = require("../utils/razorpay");
const crypto = require("crypto");
const pool = require("../db");

/* =========================
   CREATE ORDER
========================= */
exports.createOrder = async (req, res) => {
  const clientId = req.user.user_id; // 👈 from JWT

  try {
    const existing = await pool.query(
      `SELECT consultation_paid 
       FROM client_subscriptions 
       WHERE client_id = $1`,
      [clientId]
    );

    if (existing.rows.length > 0 && existing.rows[0].consultation_paid) {
      return res.status(400).json({ message: "Consultation already paid" });
    }

    const options = {
      amount: 500 * 100,
      currency: "INR",
      receipt: `client_${clientId}`,
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

/* =========================
   VERIFY PAYMENT
========================= */
exports.verifyPayment = async (req, res) => {
  console.log("Verifying payment with data:", req.body);

  const {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
} = req.body;

const clientId = req.user.user_id; // 👈 from JWT

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSign !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment signature" });
  }

  try {
    // Insert or update subscription
    await pool.query(
      `INSERT INTO client_subscriptions
       (client_id, consultation_paid, transaction_id, paid_at)
       VALUES ($1, TRUE, $2, NOW())
       ON CONFLICT (client_id)
       DO UPDATE SET
         consultation_paid = TRUE,
         transaction_id = EXCLUDED.transaction_id,
         paid_at = NOW()`,
      [clientId, razorpay_payment_id]
    );

    res.json({ message: "Payment verified successfully" });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

/* =========================
   CHECK CONSULTATION STATUS
========================= */
exports.checkConsultationPayment = async (req, res) => {
  try {
    const clientId = req.user.user_id;

    const result = await pool.query(
      `SELECT consultation_paid 
       FROM client_subscriptions 
       WHERE client_id = $1`,
      [clientId]
    );

    if (result.rows.length === 0) {
      return res.json({ consultation_paid: false });
    }

    res.json({ consultation_paid: result.rows[0].consultation_paid });

  } catch (err) {
    console.error("Error checking consultation payment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   PAYMENT HISTORY
========================= */
exports.getPaymentHistory = async (req, res) => {
  try {
    const clientId = req.user.user_id;

    const result = await pool.query(
      `SELECT transaction_id, consultation_paid, paid_at
       FROM client_subscriptions
       WHERE client_id = $1`,
      [clientId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching payment history:", err);
    res.status(500).json({ message: "Server error" });
  }
};