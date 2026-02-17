const razorpay = require("../utils/razorpay");
const crypto = require("crypto");
const pool = require("../db");


exports.createOrder = async (req, res) => {
  const { caseId } = req.body;

  try {
    const options = {
      amount: 500 * 100, // ₹500 consultation fee
      currency: "INR",
      receipt: `case_${caseId}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }
};


exports.verifyPayment = async (req, res) => {
  console.log("Verifying payment with data:", req.body);

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    caseId,
  } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSign !== razorpay_signature) {
    console.warn("Payment signature mismatch:", {
      expectedSign,
      receivedSign: razorpay_signature,
    });
    return res.status(400).json({ message: "Invalid payment signature" });
  }

  try {
    await pool.query(
      `INSERT INTO payments (
          case_id,
          payment_type,
          amount,
          status,
          transaction_id,
          payment_date
       )
       VALUES ($1, 'CONSULTATION', 500, 'PAID', $2, NOW())`,
      [caseId, razorpay_payment_id]
    );

    res.json({ message: "Payment verified successfully" });

  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

exports.checkConsultationPaid = async (req, res) => {
  const { caseId } = req.params;

  const result = await pool.query(
    `SELECT * FROM payments
     WHERE case_id = $1
     AND payment_type = 'CONSULTATION'
     AND status = 'PAID'`,
    [caseId]
  );

  res.json({ paid: result.rows.length > 0 });
};
