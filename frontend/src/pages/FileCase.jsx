import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/ClientSidebar";
import { fileNewCase } from "../api/clientApi";
import { generateCaseDescription } from "../api/aiApi";

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
      const clientId = localStorage.getItem("userId");

      if (!clientId) {
        alert("Client not logged in. Please login again.");
        return;
      }

      const payload = {
        client_id: clientId,
        case_title: formData.case_title,
        case_type: formData.case_type,
        case_description: formData.case_description,
      };

      await fileNewCase(payload);

      alert("Case filed successfully!");
      navigate("/Mycase");
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
    <div className="client-layout">
      <Sidebar />

      <main className="client-content">
        <h1>File a New Case</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "25px",
            marginTop: "20px",
            alignItems: "start",
            maxWidth: "1000px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {/* LEFT FORM SECTION */}
          <div>
            <form onSubmit={handleSubmit} className="case-form">
              <label>Case Title</label>
              <input
                type="text"
                name="case_title"
                value={formData.case_title}
                onChange={handleChange}
                required
              />

              <label>Case Type</label>
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

              <button type="submit" className="action-btn">
                Submit Case Request
              </button>
            </form>
          </div>

          {/* RIGHT AI PANEL */}
          <div
            style={{
              width: "100%",
              maxWidth: "270px",
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              padding: "18px",
              boxShadow: "0px 8px 18px rgba(0,0,0,0.12)",
              border: "1px solid #e5e7eb",
              justifySelf: "end",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>
              🤖 AI Assistant
            </h3>

            <p
              style={{
                fontSize: "13px",
                color: "#555",
                marginBottom: "12px",
                lineHeight: "1.4",
              }}
            >
              Type your issue briefly and AI will draft a professional case
              description.
            </p>

            <textarea
              rows="4"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Explain your issue..."
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                outline: "none",
                resize: "none",
                backgroundColor: "#ffffff",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}

            />

            <button
              type="button"
              className="action-btn"
              style={{
                width: "100%",
                backgroundColor: "#1e40af",
                marginTop: "12px",
                padding: "10px",
                borderRadius: "10px",
                fontSize: "14px",
              }}
              disabled={aiLoading}
              onClick={handleGenerateAI}
            >
              {aiLoading ? "Generating..." : "Generate"}
            </button>

            <p
              style={{
                fontSize: "12px",
                marginTop: "12px",
                color: "#666",
                lineHeight: "1.4",
              }}
            >
              <b>Tip:</b> Enter case title + type for best output.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FileCase;
