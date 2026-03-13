import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../newstyles.css";

function CaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/advocate/case/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setCaseData(res.data);
      } catch (err) {
        console.error("Error fetching case:", err);
      }
    };
    fetchCase();
  }, [id]);

  if (!caseData) {
    return (
      <div className="client-dashboard-new">
        <p style={{ color: "white", padding: "20px" }}>Loading case details...</p>
      </div>
    );
  }

  return (
    <div className="client-dashboard-new">
      <div className="documents-header-new">
        <h1 className="page-title-new">Case Details: {caseData.case_title}</h1>
        <div className="documents-header-buttons">
          <button
            className="dashboard-btn-new"
            onClick={() => navigate("/dashboard/advocate/cases")}
          >
            ← All Cases
          </button>
        </div>
      </div>

      <div className="upload-box-new">
        <div className="form-card-new">
          <table className="details-table-new">
            <tbody>
              <tr>
                <th>Case ID</th>
                <td>{caseData.case_id}</td>
              </tr>
              <tr>
                <th>Case Title</th>
                <td className="bold-text">{caseData.case_title}</td>
              </tr>
              <tr>
                <th>Case Type</th>
                <td>{caseData.case_type}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td>{caseData.case_description}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>
                  <span className={`status-pill ${caseData.status.toLowerCase()}`}>
                    {caseData.status}
                  </span>
                </td>
              </tr>
              <tr>
                <th>Next Hearing</th>
                <td>
                  {caseData.next_hearing_date
                    ? new Date(caseData.next_hearing_date).toLocaleDateString()
                    : "Not Scheduled"}
                </td>
              </tr>
              <tr>
                <th>Created At</th>
                <td>{new Date(caseData.created_at).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>

          <div className="details-actions-new">
            <button
              className="primary-btn-new"
              disabled={caseData.status === "CLOSED"}
              onClick={() => navigate(`/dashboard/advocate/hearings?case=${caseData.case_id}`)}
            >
              Update Hearing Date
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaseDetails;