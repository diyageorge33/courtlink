const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment, checkConsultationPaid} = require("../controllers/payment.controller");

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/check/:caseId", checkConsultationPaid);

module.exports = router;
