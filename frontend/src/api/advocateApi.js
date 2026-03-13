import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const fetchAdvocateDashboardStats = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:5000/api/advocate/dashboard/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchAdvocateCases = async (id, params = {}) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:5000/api/advocate/cases/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return response.data;
};

export const fetchAdvocateClients = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:5000/api/advocate/clients`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
