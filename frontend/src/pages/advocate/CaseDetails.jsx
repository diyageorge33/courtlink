import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function CaseDetails() {
  const { id } = useParams();
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

  if (!caseData) return <p>Loading case details...</p>;

  return (
    <div>
      <h2>Case Details</h2>

      <table className="cases-table">
        <tbody>

          <tr>
            <th>Case ID</th>
            <td>{caseData.case_id}</td>
          </tr>

          <tr>
            <th>Case Title</th>
            <td>{caseData.case_title}</td>
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
            <td>{caseData.status}</td>
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
            <th>Created</th>
            <td>
              {new Date(caseData.created_at).toLocaleDateString()}
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  );
}

export default CaseDetails;