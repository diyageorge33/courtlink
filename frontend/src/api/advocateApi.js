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

export const fetchProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API_BASE}/advocate/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const uploadProfilePhoto = async (file) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("photo", file);

  const res = await axios.post(
    `${API_BASE}/advocate/upload-profile`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const fetchAllAdvocates = async () => {
  const res = await axios.get("http://localhost:5000/api/advocate/all");
  return res.data;
};

export const updateAdvocateProfile = async (data) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(
    "http://localhost:5000/api/advocate/profile",
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
};

export const fetchBookings = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    "http://localhost:5000/api/advocate/bookings",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
};