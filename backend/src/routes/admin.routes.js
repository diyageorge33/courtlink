const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
  getClients,
  getAdvocates,
  getCases,
  getClosureRequests,
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
    approveClientClosure,
    rejectClientClosure,
    approveAdvocateClosure,
    rejectAdvocateClosure,
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
router.get("/closure-requests", verifyToken, getClosureRequests);
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
router.put("/approve-client-closure/:clientId", verifyToken, approveClientClosure);
router.put("/reject-client-closure/:clientId", verifyToken, rejectClientClosure);
router.put("/approve-advocate-closure/:advocateId", verifyToken, approveAdvocateClosure);
router.put("/reject-advocate-closure/:advocateId", verifyToken, rejectAdvocateClosure);
router.put("/restore-advocate/:advocateId", verifyToken, restoreAdvocate);

router.delete("/delete-advocate/:advocateId", verifyToken, deleteAdvocate);

module.exports = router;
