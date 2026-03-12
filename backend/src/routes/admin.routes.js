const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
  getClients,
  getAdvocates,
  getCases,
  rejectCase,
  assignAdvocate,
  reassignAdvocate,
    getClientCases,
    suggestAdvocates,
    getClosedCases,
    closeCase,
    getAdminStats,
    reopenCase,
    deleteAdvocate,
    restoreAdvocate,
    approveCase,
    getPendingCases,
    getAnalyticsData,
    getCaseTimeline
} = require("../controllers/admin.controller");

router.get("/clients", verifyToken, getClients);
router.get("/advocates", verifyToken, getAdvocates);
router.get("/cases", verifyToken, getCases);
router.get("/client-cases/:clientId", verifyToken, getClientCases);
router.get("/suggest-advocates/:caseId", verifyToken, suggestAdvocates);
router.get("/closed-cases", verifyToken, getClosedCases);
router.get("/stats", verifyToken, getAdminStats);
router.get("/pending-cases", verifyToken, getPendingCases);
router.get("/analytics", verifyToken, getAnalyticsData);
router.get("/case-timeline/:caseId", verifyToken, getCaseTimeline);

router.post("/assign", verifyToken, assignAdvocate);
router.post("/reassign", verifyToken, reassignAdvocate);

router.put("/close-case/:caseId", verifyToken, closeCase);
router.put("/reject-case/:caseId", verifyToken, rejectCase);
router.put("/reopen-case/:caseId", verifyToken, reopenCase);
router.put("/approve-case/:caseId", verifyToken, approveCase);
router.put("/restore-advocate/:advocateId", verifyToken, restoreAdvocate);

router.delete("/delete-advocate/:advocateId", verifyToken, deleteAdvocate);

module.exports = router;