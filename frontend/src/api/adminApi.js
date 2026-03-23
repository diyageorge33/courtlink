import api from "./api";

export const fetchAdminClients = async (page = 1) => {
  const res = await api.get(`/admin/clients?page=${page}`);
  return res.data;
};

export const fetchAdminAdvocates = async () => {
  const res = await api.get("/admin/advocates");
  return res.data;
};

export const fetchAdminCases = async () => {
  const res = await api.get("/admin/cases");
  return res.data;
};

export const fetchAdminClosedCases = async () => {
  const res = await api.get("/admin/closed-cases");
  return res.data;
};

export const fetchAdminStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};

export const fetchAdminPendingCases = async () => {
  const res = await api.get("/admin/pending-cases");
  return res.data;
};

export const fetchAdminAnalytics = async () => {
  const res = await api.get("/admin/analytics");
  return res.data;
};

export const fetchAdminClientCases = async (clientId) => {
  const res = await api.get(`/admin/client-cases/${clientId}`);
  return res.data;
};

export const fetchAdminCaseTimeline = async (caseId) => {
  const res = await api.get(`/admin/case-timeline/${caseId}`);
  return res.data;
};

export const assignAdminAdvocate = async (caseId, advocateId) => {
  const res = await api.post("/admin/assign", { caseId, advocateId });
  return res.data;
};

export const reassignAdminAdvocate = async (caseId, advocateId) => {
  const res = await api.post("/admin/reassign", { caseId, advocateId });
  return res.data;
};

export const closeAdminCase = async (caseId) => {
  const res = await api.put(`/admin/close-case/${caseId}`);
  return res.data;
};

export const reopenAdminCase = async (caseId) => {
  const res = await api.put(`/admin/reopen-case/${caseId}`);
  return res.data;
};

export const approveAdminCase = async (caseId) => {
  const res = await api.put(`/admin/approve-case/${caseId}`);
  return res.data;
};

export const rejectAdminCase = async (caseId) => {
  const res = await api.put(`/admin/reject-case/${caseId}`);
  return res.data;
};

export const deleteAdminAdvocate = async (advocateId) => {
  const res = await api.delete(`/admin/delete-advocate/${advocateId}`);
  return res.data;
};

export const restoreAdminAdvocate = async (advocateId) => {
  const res = await api.put(`/admin/restore-advocate/${advocateId}`);
  return res.data;
};

export const fetchPendingAdminAdvocates = async () => {
  const res = await api.get("/auth/admin/pending-advocates");
  return res.data;
};

export const approvePendingAdminAdvocate = async (id) => {
  const res = await api.put("/auth/admin/approve-advocate", { id });
  return res.data;
};

export const rejectPendingAdminAdvocate = async (id) => {
  const res = await api.put("/auth/admin/reject-advocate", { id });
  return res.data;
};

export const fetchAdminClosureRequests = async () => {
  const res = await api.get("/admin/closure-requests");
  return res.data;
};

export const approveAdminClientClosure = async (clientId) => {
  const res = await api.put(`/admin/approve-client-closure/${clientId}`);
  return res.data;
};

export const rejectAdminClientClosure = async (clientId) => {
  const res = await api.put(`/admin/reject-client-closure/${clientId}`);
  return res.data;
};

export const approveAdminAdvocateClosure = async (advocateId) => {
  const res = await api.put(`/admin/approve-advocate-closure/${advocateId}`);
  return res.data;
};

export const rejectAdminAdvocateClosure = async (advocateId) => {
  const res = await api.put(`/admin/reject-advocate-closure/${advocateId}`);
  return res.data;
};
