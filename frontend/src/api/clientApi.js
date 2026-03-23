import api from "./api";

/* DASHBOARD */
export const fetchClientDashboardStats = async () => {
  const res = await api.get("/client/dashboard/stats");
  return res.data;
};

/* CASES */
export const fetchClientCases = async (page = 1) => {
  const res = await api.get(`/client/cases?page=${page}`);
  return res.data;
};

export const fileNewCase = async (caseData) => {
  const res = await api.post("/client/filecase", caseData);
  return res.data;
};

/* DOCUMENTS */
export const uploadClientDocument = async (formData) => {
  const res = await api.post("/client/upload-document", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const fetchClientDocuments = async (page = 1) => {
  try {
    const res = await api.get(`/client/documents/client?page=${page}`);
    return res.data || [];
  } catch (err) {
    console.error("Fetch documents error:", err);
    return []; // ✅ prevents crash
  }
};

export const deleteClientDocument = async (documentId) => {
  const res = await api.delete(`/client/documents/${documentId}`);
  return res.data;
};

/* SETTINGS */
export const fetchClientSettings = async () => {
  const res = await api.get("/client/settings"); // 🔥 THIS CALLS BACKEND
  return res.data;
};

export const updateClientSettings = async (data) => {
  const res = await api.put("/client/settings", data);
  return res.data;
};

/* ACCOUNT CLOSURE */
export const requestAccountClosure = async () => {
  const res = await api.post("/client/request-closure");
  return res.data;
};

export const cancelAccountClosure = async () => {
  const res = await api.post("/client/cancel-closure");
  return res.data;
};

/* ADVOCATES */
export const fetchClientAdvocates = async () => {
  const res = await api.get("/client/advocates");
  return res.data;
};