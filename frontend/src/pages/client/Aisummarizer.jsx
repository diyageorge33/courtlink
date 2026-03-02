import { useState } from "react";
import Sidebar from "../../components/ClientSidebar";

function Aisummarizer() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
  if (!file) {
    alert("Please upload a PDF or TXT file first!");
    return;
  }
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(
      "http://localhost:5000/api/ai/summarize-document",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || "Summarization failed");
      return;
    }
    setSummary(data.summary);
  } catch (error) {
    console.error("Summarizer error:", error);
    alert("AI service failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="client-layout">
      <Sidebar />

      <main className="client-content">
        <h1 className="ai-title">AI Court Order Summarizer</h1>

        <p className="ai-tagline">
          Upload your court order or judgement document and get a simplified
          summary.
        </p>

        <div className="summarizer-box">
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="summarize-btn" onClick={handleSummarize}>
            {loading ? "Summarizing..." : "Summarize"}
          </button>
        </div>

        {summary && (
          <div className="summary-output">
            <h3>Generated Summary</h3>
            <pre>{summary}</pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default Aisummarizer;
