import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchClientDocuments,
  deleteClientDocument
} from "../api/clientApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../newstyles.css";

function Document() {

  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // ✅ NEW

  useEffect(() => {

    const loadDocuments = async () => {
      try {
        const data = await fetchClientDocuments(page); // ✅ UPDATED
        setDocuments(data);
      } catch (err) {
        console.error("Error fetching documents:", err);
        toast.error("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();

  }, [page]); // ✅ UPDATED

  const handleDelete = (documentId) => {

    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete?</p>

          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            
            <button
              onClick={async () => {
                try {
                  await deleteClientDocument(documentId);

                  const updatedDocs = await fetchClientDocuments(page); // ✅ UPDATED
                  setDocuments(updatedDocs);

                  toast.success("Document deleted successfully!");
                } catch (err) {
                  console.error("Delete error:", err);
                  toast.error("Failed to delete document.");
                }
                closeToast();
              }}
              style={{
                background: "#dc2626",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer"
              }}
            >
              Yes
            </button>

            <button
              onClick={closeToast}
              style={{
                background: "#6b7280",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>

          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );

  };

  return (

    <div className="client-dashboard-new">

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

        <>
          <div className="cases-table-wrapper-new">

            <table className="cases-table-new">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Document ID</th>
                  <th>Case ID</th>
                  <th>File Name</th>
                  <th>Uploaded At</th>
                  <th>View</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>

                {documents.map((doc, index) => (

                  <tr key={doc.document_id}>

                    <td>{(page - 1) * 5 + index + 1}</td>

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
                        View
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

          {/* ✅ PAGINATION BUTTONS */}
          <div style={{ marginTop: "20px", display: "flex", gap: "10px", alignItems: "center" }}>

            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>

            <span>Page {page}</span>

            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={documents.length < 5}
            >
              Next
            </button>

          </div>
        </>
      )}

    </div>
  );
}

export default Document;