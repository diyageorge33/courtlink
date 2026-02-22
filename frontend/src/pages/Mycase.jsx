import { useEffect, useState } from "react";
import Sidebar from "../components/ClientSidebar";
import { fetchClientCases } from "../api/clientApi";

function Mycase() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCases = async () => {
      try {
        
        const data = await fetchClientCases();
        console.log("🔥 cases fetched:", data);

        setCases(data);
      } catch (err) {
        console.error("❌ Error fetching cases:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);

  return (
    <div className="client-layout">
      <Sidebar />

      <main className="client-content">
        <h1>My Cases</h1>

        {loading ? (
          <p style={{ marginTop: "20px" }}>Loading cases...</p>
        ) : cases.length === 0 ? (
          <p style={{ marginTop: "20px" }}>No cases found.</p>
        ) : (
          <div style={{ marginTop: "20px" }}>
            <table className="cases-table">
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
                    <td>{c.case_title}</td>
                    <td>{c.case_type}</td>
                    <td>{c.status}</td>
                    <td>
                      {c.next_hearing_date
                        ? new Date(c.next_hearing_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Mycase;
