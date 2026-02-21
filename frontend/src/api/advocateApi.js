import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const fetchAdvocateDashboardStats = async (advocateId) => {
  const response = await axios.get(
    `${API_BASE}/advocate/dashboard/${advocateId}`
  );
  return response.data;
};
