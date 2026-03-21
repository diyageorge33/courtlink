import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchClientCases,
  uploadClientDocument
} from "../api/clientApi";
import "../newstyles.css";

function UploadDocuments() {

  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {

    const loadCases = async () => {
      try {
        const caseData = await fetchClientCases();
        setCases(caseData);
      } catch (err) {
        console.error("Error loading cases:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCases();

  }, []);

  const handleUpload = async () => {

    try {

      if (!selectedCase) {
        alert("Please select a case first.");
        return;
      }

      if (!file) {
        alert("Please choose a file to upload.");
        return;
      }

      // ✅ File type validation
      const allowedTypes = [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "audio/mpeg",
        "audio/wav",
        "image/jpeg",
        "image/png"
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("Unsupported file type!");
        return;
      }

      // ✅ File size validation (10MB)
      const maxSize = 10 * 1024 * 1024;

      if (file.size > maxSize) {
        alert("File too large! Max 10MB allowed.");
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append("case_id", selectedCase);
      formData.append("file", file);

      await uploadClientDocument(formData);

      alert("Document uploaded successfully!");

      navigate("/dashboard/client/document");

    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }

  };

  return (

    <div className="client-dashboard-new">

      {/* PAGE HEADER */}
      <div className="documents-header-new">

        <h1 className="page-title-new">Upload Documents</h1>

        <div className="documents-header-buttons">

          <button
            className="dashboard-btn-new"
            onClick={() => navigate("/dashboard/client/document")}
          >
            + My Documents
          </button>

          <button
            className="dashboard-btn-new"
            onClick={() => navigate("/dashboard/client")}
          >
            ← Dashboard
          </button>

        </div>

      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (

        <div className="upload-box-new">

          <h3>Upload New Document</h3>

          <label>Select Case</label>

          <select
            value={selectedCase}
            onChange={(e) => setSelectedCase(e.target.value)}
          >
            <option value="">-- Select Case --</option>

            {cases.map((c) => (
              <option key={c.case_id} value={c.case_id}>
                {c.case_title} (#{c.case_id})
              </option>
            ))}
          </select>

          <label>Choose File</label>

          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx,.mp3,.wav,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <p style={{ fontSize: "12px", color: "#94a3b8" }}>
            Allowed: PDF, DOC, TXT, MP3, Images (Max 10MB)
          </p>

          <button
            className="primary-btn-new"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </button>

        </div>

      )}

    </div>

  );

}

export default UploadDocuments;