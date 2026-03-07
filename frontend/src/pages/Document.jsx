import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchClientDocuments,
  deleteClientDocument
} from "../api/clientApi";
import "../newstyles.css";

function Document() {

  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadDocuments = async () => {
      try {

        const data = await fetchClientDocuments();
        setDocuments(data);

      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();

  }, []);

  const handleDelete = async (documentId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) return;

    try {

      await deleteClientDocument(documentId);

      const updatedDocs = await fetchClientDocuments();
      setDocuments(updatedDocs);

      alert("Document deleted successfully.");

    } catch (err) {

      console.error("Delete error:", err);
      alert("Failed to delete document.");

    }

  };

  return (

    <div className="client-dashboard-new">

      {/* PAGE HEADER */}

      <div className="documents-header-new">

        <h1 className="page-title-new">My Documents</h1>

        <div className="documents-header-buttons">

          <button
            className="dashboard-btn-new"
            onClick={() => navigate("/dashboard/client/uploaddocuments")}
          >
            + Upload Documents
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
        <p>Loading documents...</p>
      ) : documents.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (

        <div className="cases-table-wrapper-new">

          <table className="cases-table-new">

            <thead>
              <tr>
                <th>Document ID</th>
                <th>Case ID</th>
                <th>File Name</th>
                <th>Uploaded At</th>
                <th>Open</th>
                <th>Delete</th>
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
                      View / Download
                    </a>

                  </td>

                  <td>

                    <button
                      className="delete-btn-new"
                      onClick={() => handleDelete(doc.document_id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );
}

export default Document;