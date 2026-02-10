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

  await pool.query(
    `UPDATE cases
     SET consultation_paid=true,
         payment_id=$1,
         payment_date=NOW()
     WHERE case_id=$2`,
    [razorpay_payment_id, caseId]
  );

  res.json({ message: "Payment verified successfully" });
};
