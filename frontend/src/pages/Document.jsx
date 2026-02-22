import { useEffect, useState } from "react";
import Sidebar from "../components/ClientSidebar";
import { fetchClientDocuments } from "../api/clientApi";

function Document() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const clientId = localStorage.getItem("userId");

        if (!clientId) {
          alert("Client not logged in");
          return;
        }

        const data = await fetchClientDocuments(clientId);
        setDocuments(data);
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  return (
    <div className="client-layout">
      <Sidebar />

      <main className="client-content">
        <h1>My Documents</h1>

        {loading ? (
          <p>Loading documents...</p>
        ) : documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <table className="cases-table" style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>Document ID</th>
                <th>Case ID</th>
                <th>File Name</th>
                <th>Uploaded At</th>
                <th>Open</th>
              </tr>
            </thead>

            <tbody>
              {documents.map((doc) => (
                <tr key={doc.document_id}>
                  <td>{doc.document_id}</td>
                  <td>{doc.case_id}</td>
                  <td>{doc.file_name}</td>
                  <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                  <td>
                    <a
                      href={`http://localhost:5000${doc.file_url}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View / Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default Document;
