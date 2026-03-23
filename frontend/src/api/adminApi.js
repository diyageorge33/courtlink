import axios from "axios";

const API_BASE = "http://localhost:5000/api/admin";

// 🔐 Helper for auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// ==============================
// CLIENTS
// ==============================

export const fetchClients = async () => {
  const res = await axios.get(`${API_BASE}/clients`, getAuthHeader());
  return res.data;
};

// ==============================
// ADVOCATES
// ==============================

export const fetchAdvocates = async () => {
  const res = await axios.get(`${API_BASE}/advocates`, getAuthHeader());
  return res.data;
};

// ==============================
// CASES
// ==============================

export const fetchCases = async () => {
  const res = await axios.get(`${API_BASE}/cases`, getAuthHeader());
  return res.data;
};

// ==============================
// CLIENT CASES
// ==============================

export const fetchClientCases = async (clientId) => {
  const res = await axios.get(
    `${API_BASE}/client-cases/${clientId}`,
    getAuthHeader()
  );
  return res.data;
};

// ==============================
// ASSIGN / REASSIGN
// ==============================

export const assignAdvocate = async (data) => {
  const res = await axios.post(`${API_BASE}/assign`, data, getAuthHeader());
  return res.data;
};

export const reassignAdvocate = async (data) => {
  const res = await axios.post(`${API_BASE}/reassign`, data, getAuthHeader());
  return res.data;
};

// ==============================
// CASE ACTIONS
// ==============================

export const approveCase = async (caseId) => {
  const res = await axios.put(
    `${API_BASE}/approve-case/${caseId}`,
    {},
    getAuthHeader()
  );
  return res.data;
};

export const rejectCase = async (caseId) => {
  const res = await axios.put(
    `${API_BASE}/reject-case/${caseId}`,
    {},
    getAuthHeader()
  );
  return res.data;
};

export const closeCase = async (caseId) => {
  const res = await axios.put(
    `${API_BASE}/close-case/${caseId}`,
    {},
    getAuthHeader()
  );
  return res.data;
};

export const reopenCase = async (caseId) => {
  const res = await axios.put(
    `${API_BASE}/reopen-case/${caseId}`,
    {},
    getAuthHeader()
  );
  return res.data;
};

// ==============================
// ADVOCATE MANAGEMENT
// ==============================

export const deleteAdvocate = async (id) => {
  const res = await axios.delete(
    `${API_BASE}/delete-advocate/${id}`,
    getAuthHeader()
  );
  return res.data;
};

export const restoreAdvocate = async (id) => {
  const res = await axios.put(
    `${API_BASE}/restore-advocate/${id}`,
    {},
    getAuthHeader()
  );
  return res.data;
};

// ==============================
// CLOSED / PENDING
// ==============================

export const fetchClosedCases = async () => {
  const res = await axios.get(`${API_BASE}/closed-cases`, getAuthHeader());
  return res.data;
};

export const fetchPendingCases = async () => {
  const res = await axios.get(`${API_BASE}/pending-cases`, getAuthHeader());
  return res.data;
};

// ==============================
// ANALYTICS
// ==============================

export const fetchAnalytics = async () => {
  const res = await axios.get(`${API_BASE}/analytics`, getAuthHeader());
  return res.data;
};

// ==============================
// TIMELINE
// ==============================

export const fetchCaseTimeline = async (caseId) => {
  const res = await axios.get(
    `${API_BASE}/case-timeline/${caseId}`,
    getAuthHeader()
  );
  return res.data;
};

// ==============================
// STATS
// ==============================

export const fetchAdminStats = async () => {
  const res = await axios.get(`${API_BASE}/stats`, getAuthHeader());
  return res.data;
};