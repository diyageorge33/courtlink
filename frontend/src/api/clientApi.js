import api from "./api";

export const fetchClientDashboardStats = async (clientId) => {
  const res = await api.get(`/client/dashboard/stats/${clientId}`);
  return res.data;
};

export const fetchClientCases = async (clientId) => {
  const res = await api.get(`/client/cases/${clientId}`);
  return res.data;
};

export const fileNewCase = async (caseData) => {
  const res = await api.post("/client/filecase", caseData);
  return res.data;
};

export const uploadClientDocument = async (formData) => {
  const res = await api.post("/client/upload-document", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const fetchClientDocuments = async (clientId) => {
  const res = await api.get(`/client/documents/client/${clientId}`);
  return res.data;
};

export const fetchClientSettings = async (clientId) => {
  const res = await api.get(`/client/settings/${clientId}`);
  return res.data;
};

export const updateClientSettings = async (clientId, data) => {
  const res = await api.put(`/client/settings/${clientId}`, data);
  return res.data;
};

