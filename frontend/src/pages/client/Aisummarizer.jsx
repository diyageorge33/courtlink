import { useState } from "react";
import Sidebar from "../../components/ClientSidebar";

function Aisummarizer() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = () => {
    if (!file) {
      alert("Please upload a court order file first!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setSummary(
        `Summary of Court Order:\n\n` +
          `• The court reviewed the submitted case documents.\n` +
          `• The hearing has been scheduled for the next available date.\n` +
          `• The respondent has been instructed to submit evidence.\n` +
          `• Final decision is pending.\n\n` +
          `Note: This is a dummy summary. AI integration will be added later.`
      );

      setLoading(false);
    }, 2000);
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
