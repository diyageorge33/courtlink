import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../layouts/DashboardLayout";

function AddCase() {
  const advocateId = localStorage.getItem("user_id");
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
    const advocate_id = localStorage.getItem("user_id");

    await axios.post("http://localhost:5000/api/advocate/add-case", {
      ...formData,
      advocate_id
    });

    navigate("/dashboard/advocate/cases");

  } catch (err) {
    console.error("FULL ERROR:", err);
    console.error("SERVER ERROR:", err.response?.data);
    alert("Error adding case");
  }
};
return (
  <DashboardLayout role="advocate">

    <div className="add-case-card">

      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        Add New Case
      </h2>

      <form onSubmit={handleSubmit} className="add-case-form">

        <div className="form-group">
          <label>Case Title</label>
          <input
            type="text"
            name="case_title"
            value={formData.case_title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Case Type</label>
          <input
            type="text"
            name="case_type"
            value={formData.case_type}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Case Description</label>
          <textarea
            name="case_description"
            value={formData.case_description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Client ID</label>
          <input
            type="number"
            name="client_id"
            value={formData.client_id}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Create Case
        </button>

      </form>

    </div>

  </DashboardLayout>
);
 
  return (
    <div className="add-case-container">
      <h2>Add New Case</h2>

      <form onSubmit={handleSubmit} className="add-case-form">

        <div className="form-group">
            <label>Case Title</label>
            <input
            type="text"
            name="case_title"
            value={formData.case_title}
            onChange={handleChange}
            required
            />
        </div>

        <div className="form-group">
            <label>Case Type</label>
            <input
            type="text"
            name="case_type"
            value={formData.case_type}
            onChange={handleChange}
            required
            />
        </div>

        <div className="form-group">
            <label>Case Description</label>
            <textarea
            name="case_description"
            value={formData.case_description}
            onChange={handleChange}
            rows="4"
            required
            />
        </div>

        <div className="form-group">
            <label>Client ID</label>
            <input
            type="number"
            name="client_id"
            value={formData.client_id}
            onChange={handleChange}
            required
            />
        </div>

        <button type="submit" className="submit-btn">
            Create Case
        </button>

        </form>
    </div>
  );
}

export default AddCase;