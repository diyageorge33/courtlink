import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchClientCases } from "../api/clientApi";
import { toast } from "react-toastify";
import "../newstyles.css";

function Mycase() {

  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [confirmCase, setConfirmCase] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadCases();
  }, [page]);

  const loadCases = async () => {
    try {
      const res = await fetchClientCases(page);

      setCases(res.data);

      // ✅ correct next button logic
      const totalPages = Math.ceil(res.total / 5);
      setHasMore(page < totalPages);

    } catch (err) {
      console.error("Error fetching cases:", err);
      toast.error("Failed to load cases");
    } finally {
      setLoading(false);
    }
  };

  const getHearingDate = (date) => {
    if (!date) return "N/A";

    const today = new Date();
    const hearingDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    hearingDate.setHours(0, 0, 0, 0);

    return hearingDate >= today
      ? hearingDate.toLocaleDateString()
      : "N/A";
  };

  const handleWithdraw = async (caseId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/client/withdraw-case/${caseId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      toast.success(data.message);

      loadCases();

    } catch (err) {
      console.error(err);
      toast.error("Error withdrawing case");
    }
  };

  const handleResubmit = async (caseId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/client/resubmit-case/${caseId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      toast.success(data.message);

      loadCases();

    } catch (err) {
      console.error(err);
      toast.error("Error resubmitting case");
    }
  };

  return (

    <div className="client-dashboard-new">

      <div className="documents-header-new">

        <h1 className="page-title-new">My Cases</h1>

        <div className="documents-header-buttons">

          <button
            className="dashboard-btn-new"
            onClick={() => navigate("/dashboard/client/filecase")}
          >
            + File Case
          </button>

          <button
            className="dashboard-btn-new"
            onClick={() => navigate("/dashboard/client")}
          >
            ← Dashboard
          </button>

        </div>

      </div>

      <p className="table-hint-new">
        Click on a case title to view its description below.
      </p>

      {loading ? (
        <p>Loading cases...</p>
      ) : cases.length === 0 ? (
        <p>No cases found.</p>
      ) : (

        <>
          <div className="cases-table-wrapper-new">

            <table className="cases-table-new">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Case ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Next Hearing</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {cases.map((c, index) => (

                  <tr key={c.case_id}>

                    <td>{(page - 1) * 5 + index + 1}</td>

                    <td>{c.case_id}</td>

                    <td>
                      <span
                        className="case-title-link"
                        onClick={() => setSelectedCase(c)}
                      >
                        {c.case_title}
                      </span>
                    </td>

                    <td>{c.case_type}</td>

                    <td>{c.status}</td>

                    <td>{getHearingDate(c.next_hearing_date)}</td>

                    <td>
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>

                    <td>

                      {c.status === "PENDING" && (
                        <button
                          className="mycase-danger-btn"
                          onClick={() => setConfirmCase(c.case_id)}
                        >
                          Withdraw
                        </button>
                      )}

                      {c.status === "WITHDRAWN" && (
                        <button
                          className="mycase-primary-btn"
                          onClick={() => handleResubmit(c.case_id)}
                        >
                          Resubmit
                        </button>
                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* ✅ PAGINATION */}
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
              disabled={!hasMore}
            >
              Next
            </button>

          </div>
        </>
      )}

      {/* CONFIRM MODAL */}
      {confirmCase && (
        <div className="confirm-overlay">
          <div className="confirm-box">

            <p>Are you sure you want to withdraw this case?</p>

            <div className="confirm-actions">

              <button
                className="mycase-danger-btn"
                onClick={() => {
                  handleWithdraw(confirmCase);
                  setConfirmCase(null);
                }}
              >
                Yes, Withdraw
              </button>

              <button
                className="mycase-primary-btn"
                onClick={() => setConfirmCase(null)}
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

      {selectedCase && (
        <div className="case-description-card">
          <h3>Case Description</h3>
          <p>
            {selectedCase.case_description || "No description available."}
          </p>
        </div>
      )}

    </div>
  );
}

export default Mycase;