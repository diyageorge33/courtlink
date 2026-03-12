import api from "./api";

export const fetchClientDashboardStats = async () => {
  const res = await api.get(`/client/dashboard/stats`);
  return res.data;
};

export const fetchClientCases = async () => {
  const res = await api.get(`/client/cases`);
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

export const fetchClientDocuments = async () => {
  const res = await api.get(`/client/documents/client`);
  return res.data;
};

export const fetchClientSettings = async () => {
  const res = await api.get(`/client/settings`);
  return res.data;
};

export const updateClientSettings = async (data) => {
  const res = await api.put(`/client/settings`, data);
  return res.data;
};

export const deleteClientDocument = async (documentId) => {

  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:5000/api/client/documents/${documentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
};