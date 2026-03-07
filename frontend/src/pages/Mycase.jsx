
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchClientCases } from "../api/clientApi";
import "../newstyles.css";

function Mycase() {

  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {

    const loadCases = async () => {
      try {

        const data = await fetchClientCases();
        setCases(data);

      } catch (err) {
        console.error("Error fetching cases:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCases();

  }, []);

  return (

    <div className="client-dashboard-new">

      {/* HEADER */}

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

        <div className="cases-table-wrapper-new">

          <table className="cases-table-new">

            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Next Hearing</th>
                <th>Created At</th>
              </tr>
            </thead>

            <tbody>

              {cases.map((c) => (

                <tr key={c.case_id}>

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

                  <td>
                    {c.next_hearing_date
                      ? new Date(c.next_hearing_date).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

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