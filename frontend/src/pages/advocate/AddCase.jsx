import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "../../newstyles.css";

function AddCase() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    case_title: "",
    case_type: "",
    case_description: "",
    client_id: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.warn("Please login first");
        navigate("/login");
        return;
      }

      // Decode JWT to get advocate id
      const decoded = jwtDecode(token);
      const advocate_id = decoded.user_id;

      await axios.post(
        "http://localhost:5000/api/advocate/add-case",
        {
          ...formData,
          advocate_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Case filed successfully!");
      navigate("/dashboard/advocate/cases");

    } catch (err) {
      console.error("FULL ERROR:", err);
      console.error("SERVER ERROR:", err.response?.data);
      toast.error("Error adding case");
    }
  };

  return (
    <div className="client-dashboard-new">
      <div className="documents-header-new">
        <h1 className="page-title-new">Add New Case</h1>

        <div className="documents-header-buttons">
          <button
            className="dashboard-btn-new"
            onClick={() => navigate("/dashboard/advocate")}
          >
            ← Dashboard
          </button>
        </div>
      </div>

      <div className="upload-box-new">
        <div className="form-card-new">
          <form onSubmit={handleSubmit}>
            <label>Case Title</label>
            <input
              type="text"
              name="case_title"
              value={formData.case_title}
              onChange={handleChange}
              placeholder="Enter case title"
              required
            />

            <label>Case Type</label>
            <input
              type="text"
              name="case_type"
              value={formData.case_type}
              onChange={handleChange}
              placeholder="Civil / Criminal / Family..."
              required
            />

            <label>Case Description</label>
            <textarea
              name="case_description"
              value={formData.case_description}
              onChange={handleChange}
              rows="6"
              placeholder="Explain the case details..."
              required
            />

            <label>Client ID</label>
            <input
              type="number"
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              placeholder="Enter client's user ID"
              required
            />

            <button type="submit" className="primary-btn-new">
              Create Case Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCase;