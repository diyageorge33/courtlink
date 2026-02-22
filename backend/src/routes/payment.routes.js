const express = require("express");
const router = express.Router();
const { 
    createOrder, 
    verifyPayment, 
    checkConsultationPayment,
    getPaymentHistory
} = require("../controllers/payment.controller");
const { get } = require("../utils/mailer");

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/consultation-status/:clientId", checkConsultationPayment);
router.get("/history/:clientId", getPaymentHistory);

module.exports = router;
