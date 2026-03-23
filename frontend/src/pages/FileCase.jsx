import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fileNewCase } from "../api/clientApi";
import { generateCaseDescription } from "../api/aiApi";
import "../newstyles.css";

function FileCase() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    case_title: "",
    case_type: "",
    case_description: "",
  });

  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fileNewCase({
        case_title: formData.case_title,
        case_type: formData.case_type,
        case_description: formData.case_description,
      });

      alert("Case filed successfully!");
      navigate("/dashboard/client/mycases");

    } catch (err) {
      console.error("Error filing case:", err);
      alert("Failed to file case");
    }
  };

  const handleGenerateAI = async () => {
    try {
      if (!formData.case_title.trim()) {
        alert("Please enter Case Title first.");
        return;
      }

      if (!formData.case_type) {
        alert("Please select a case type first.");
        return;
      }

      if (!aiInput.trim()) {
        alert("Please explain your issue briefly for AI.");
        return;
      }

      setAiLoading(true);

      const result = await generateCaseDescription({
        case_title: formData.case_title,
        case_type: formData.case_type,
        user_input: aiInput,
      });

      setFormData({ ...formData, case_description: result.description });

    } catch (err) {
      console.error("AI error:", err);
      alert("AI failed to generate description");

    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="client-dashboard-new">

      {/* HEADER */}
      <div className="documents-header-new">
        <h1 className="page-title-new">File a New Case</h1>

        <div className="documents-header-buttons">
          <button
            className="dashboard-btn-new"
            onClick={() => navigate("/Mycase")}
          >
            + My Cases
          </button>

          <button
            className="dashboard-btn-new"
            onClick={() => navigate("/dashboard/client")}
          >
            ← Dashboard
          </button>
        </div>
      </div>

      <div className="filecase-grid-new">

        {/* FORM */}
        <div className="form-card-new">
          <form onSubmit={handleSubmit}>

            {/* CASE TITLE */}
            <label>Case Title</label>
            <input
              type="text"
              name="case_title"
              value={formData.case_title}
              onChange={handleChange}
              required
            />

            {/* CASE TYPE */}
            <label>Case Type</label>

            <div className="case-type-row-new">
              <select
  name="case_type"
  value={formData.case_type}
  onChange={handleChange}
  required
  style={{
    backgroundColor: "#0f172a",   // dark background
    color: "#e2e8f0",             // light text
    border: "1px solid #334155",
    padding: "10px",
    borderRadius: "8px",
    width: "100%",
    outline: "none",
    fontSize: "14px",
    marginBottom: "25px"
  }}
>
  <option value="">Select Case Type</option>
  <option value="Criminal">Criminal</option>
  <option value="Civil">Civil</option>
  <option value="Family">Family</option>
  <option value="Corporate">Corporate</option>
  <option value="Commercial">Commercial</option>
  <option value="Labour">Labour</option>
  <option value="Consumer">Consumer</option>
  <option value="Constitutional">Constitutional</option>
  <option value="Taxation">Taxation</option>
  <option value="Intellectual Property">Intellectual Property</option>
  <option value="Cyber Law">Cyber Law</option>
  <option value="Environmental">Environmental</option>
  <option value="Arbitration & Mediation">Arbitration & Mediation</option>
  <option value="Other">Other</option>
</select>

              <button
                type="button"
                className="link-btn-new"
                onClick={() => navigate("/dashboard/client/case-type-guide")}
              >
                Identify case type
              </button>
            </div>

            {/* CASE DESCRIPTION */}
            <label>Case Description</label>
            <textarea
              name="case_description"
              value={formData.case_description}
              onChange={handleChange}
              rows="7"
              placeholder="Explain your issue briefly..."
            />

            {/* SUBMIT */}
            <button type="submit" className="primary-btn-new">
              Submit Case Request
            </button>

          </form>
        </div>

        {/* AI ASSISTANT */}
        <div className="ai-card-new">
          <h3>AI Assistant</h3>

          <p className="ai-description-new">
            Type your issue briefly and AI will draft a professional case description.
          </p>

          <textarea
            rows="4"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Explain your issue..."
          />

          <button
            type="button"
            className="primary-btn-new"
            onClick={handleGenerateAI}
            disabled={aiLoading}
          >
            {aiLoading ? "Generating..." : "Generate"}
          </button>

          <p className="ai-tip-new">
            Tip: Enter case title + type for best output.
          </p>
        </div>

      </div>
    </div>
  );
}

export default FileCase;