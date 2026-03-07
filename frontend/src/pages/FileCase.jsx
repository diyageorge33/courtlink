
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

            <label>Case Title</label>

            <input
              type="text"
              name="case_title"
              value={formData.case_title}
              onChange={handleChange}
              required
            />

            <div className="case-type-row-new">

              <label>Case Type</label>

              <button
                type="button"
                className="link-btn-new"
                onClick={() => navigate("/dashboard/client/case-type-guide")}
              >
                Identify case type
              </button>

            </div>

            <input
              type="text"
              name="case_type"
              value={formData.case_type}
              onChange={handleChange}
              placeholder="Civil / Criminal / Family..."
            />

            <label>Case Description</label>

            <textarea
              name="case_description"
              value={formData.case_description}
              onChange={handleChange}
              rows="7"
              placeholder="Explain your issue briefly..."
            />

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