import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../newstyles.css";

function AdvocateCases() {
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();
  const advocateId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/advocate/cases/${advocateId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const statusOrder = {
          PENDING: 1,
          ONGOING: 2,
          CLOSED: 3,
        };

        const sortedCases = res.data.sort(
          (a, b) => statusOrder[a.status] - statusOrder[b.status]
        );

        setCases(sortedCases);
      } catch (err) {
        console.error("Error fetching cases:", err);
      }
    };

    fetchCases();
  }, [advocateId]);

  const deleteCase = async (caseId) => {
    if (!window.confirm("Are you sure you want to delete this case?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/advocate/delete-case/${caseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCases(cases.filter(c => c.case_id !== caseId));
    } catch (err) {
      console.error(err);
      alert("Error deleting case");
    }
  };

  return (
    <div className="client-dashboard-new">
      <div className="documents-header-new">
        <h1 className="page-title-new">My Assigned Cases</h1>
        <div className="documents-header-buttons">
          <button
            className="dashboard-btn-new"
            onClick={() => navigate("/dashboard/advocate")}
          >
            ← Dashboard
          </button>
        </div>
      </div>

      <div className="table-container-new">
        <table className="custom-table-new">
          <thead>
            <tr>
              <th>#</th>
              <th>Case Title</th>
              <th>Case Type</th>
              <th>Status</th>
              <th>Next Hearing</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c, index) => (
              <tr key={c.case_id}>
                <td>{index + 1}</td>
                <td className="bold-text">{c.case_title}</td>
                <td>{c.case_type}</td>
                <td>
                  <span className={`status-pill ${c.status.toLowerCase()}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  {c.next_hearing_date
                    ? new Date(c.next_hearing_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Not Scheduled"}
                </td>
                <td style={{ textAlign: "right" }}>
                  <div className="action-cell" style={{ justifyContent: "flex-end" }}>
                    <button
                      className="icon-btn-view"
                      onClick={() =>
                        navigate(`/dashboard/advocate/case/${c.case_id}`)
                      }
                      title="View Details"
                    >
                      View
                    </button>
                    <button
                      className="icon-btn-edit"
                      disabled={c.status === "CLOSED"}
                      onClick={() =>
                        navigate(`/dashboard/advocate/hearings?case=${c.case_id}`)
                      }
                      title="Schedule Hearing"
                    >
                      Schedule
                    </button>
                    <button
                      className="icon-btn-delete"
                      onClick={() => deleteCase(c.case_id)}
                      title="Remove Case"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdvocateCases;