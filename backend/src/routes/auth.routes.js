const express = require("express");
const router = express.Router();

const {
        login, 
        register,
        forgotPassword, 
        resetPassword,
        verifyOtp,
        resendOtp,
        getPendingAdvocates,
        rejectAdvocate,
        approveAdvocate
    } = require("../controllers/auth.controller");

router.post("/login", login);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/admin/pending-advocates", getPendingAdvocates);
router.put("/admin/reject-advocate", rejectAdvocate);
router.put("/admin/approve-advocate", approveAdvocate);


module.exports = router;

