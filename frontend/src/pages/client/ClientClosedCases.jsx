import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ClientClosedCases() {

  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/client/cases/closed",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setCases(data);
        } else {
          setCases([]);
        }

      } catch (err) {
        console.error(err);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  return (

    <div className="client-dashboard-new">

        <h1 className="page-title-new">Closed Cases</h1>
        <p
  style={{
    marginTop: "8px",
    color: "#94a3b8",
    fontSize: "14px"
        }}
        >
        See 'my cases' section to know more about your case details.
        </p>

      {loading ? (
        <p>Loading...</p>
      ) : cases.length === 0 ? (
        <p>No closed cases</p>
      ) : (

        <div className="cases-table-wrapper-new">

          <table className="cases-table-new">

            <thead>
              <tr>
                <th>Case ID</th>
                <th>Case Name</th>
                <th>Case Type</th>
              </tr>
            </thead>

            <tbody>
              {cases.map((c) => (
                <tr key={c.case_id}>
                  <td>{c.case_id}</td>
                  <td>{c.case_title}</td>
                  <td>{c.case_type}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      )}

    </div>

  );
}

export default ClientClosedCases;