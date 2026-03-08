const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
  getClients,
  getAdvocates,
  getCases,
  assignAdvocate,
  reassignAdvocate,
    getClientCases,
    suggestAdvocates
} = require("../controllers/admin.controller");

router.get("/clients", verifyToken, getClients);
router.get("/advocates", verifyToken, getAdvocates);
router.get("/cases", verifyToken, getCases);
router.get("/client-cases/:clientId", verifyToken, getClientCases);
router.get("/suggest-advocates/:caseId", verifyToken, suggestAdvocates);

router.post("/assign", verifyToken, assignAdvocate);
router.post("/reassign", verifyToken, reassignAdvocate);

module.exports = router;