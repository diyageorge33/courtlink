const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
  checkConsultationPayment,
  getPaymentHistory
} = require("../controllers/payment.controller");

const { verifyToken } = require("../middleware/authMiddleware");

router.post("/create-order", verifyToken, createOrder);
router.post("/verify-payment", verifyToken, verifyPayment);
router.get("/consultation-status/:clientId", verifyToken, checkConsultationPayment);
router.get("/history/:clientId", verifyToken, getPaymentHistory);

module.exports = router;
