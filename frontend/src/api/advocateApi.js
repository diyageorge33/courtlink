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

export const fetchAdvocateSchedules = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:5000/api/advocate/schedules`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addAdvocateSchedule = async (data) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`http://localhost:5000/api/advocate/schedules`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteAdvocateSchedule = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`http://localhost:5000/api/advocate/schedules/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const submitResignationRequest = async (reason) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `http://localhost:5000/api/advocate/resignation`,
    { reason },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const checkResignationStatus = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:5000/api/advocate/resignation/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const cancelResignationRequest = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`http://localhost:5000/api/advocate/resignation`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
