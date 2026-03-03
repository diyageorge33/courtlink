import { useEffect, useState } from "react";
import Sidebar from "../components/ClientSidebar";
import {
  fetchClientCases,
  uploadClientDocument,
  fetchClientDocuments,
} from "../api/clientApi";

function UploadDocuments() {
  const [cases, setCases] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedCase, setSelectedCase] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const caseData = await fetchClientCases();
        setCases(caseData);

        const docData = await fetchClientDocuments();
        setDocuments(docData);
      } catch (err) {
        console.error("Error loading documents page:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

      setUploading(true);

      const formData = new FormData();
      formData.append("case_id", selectedCase);
      formData.append("file", file);

      await uploadClientDocument(formData);

      alert("Document uploaded successfully!");

      const updatedDocs = await fetchClientDocuments();
      setDocuments(updatedDocs);

      setFile(null);
      setSelectedCase("");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="client-layout">
      <Sidebar />

      <main className="client-content">
        <h1>Upload Documents</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Upload Box */}
            <div className="upload-box">
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
                onChange={(e) => setFile(e.target.files[0])}
              />

              <button
                className="action-btn"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </button>
            </div>

            {/* Documents List */}
            <div style={{ marginTop: "30px" }}>
              <h2>Uploaded Documents</h2>

              {documents.length === 0 ? (
                <p>No documents uploaded yet.</p>
              ) : (
                <table className="cases-table">
                  <thead>
                    <tr>
                      <th>Document ID</th>
                      <th>Case ID</th>
                      <th>File Name</th>
                      <th>Uploaded At</th>
                      <th>View</th>
                    </tr>
                  </thead>

                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.document_id}>
                        <td>{doc.document_id}</td>
                        <td>{doc.case_id}</td>
                        <td>{doc.file_name}</td>
                        <td>
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </td>
                        <td>
                          <a
                            href={`http://localhost:5000${doc.file_url}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default UploadDocuments;