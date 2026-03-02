import axios from "axios";

export const generateCaseDescription = async (data) => {
  const res = await axios.post(
    "http://localhost:5000/api/ai/generate-case-description",
    data
  );
  return res.data;
};
