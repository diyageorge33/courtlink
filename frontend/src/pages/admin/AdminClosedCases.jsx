import { useEffect, useState } from "react";
import { fetchClosedCases, reopenCase } from "../../api/adminApi";
import "../../newstyles.css";
import { useNavigate } from "react-router-dom";

function AdminClosedCases() {
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setCases(await fetchClosedCases());
    };
    load();
  }, []);

  return (
    <div className="client-dashboard-new">
      <button onClick={() => navigate(-1)} className="dashboard-btn-new">← Back</button>
      <h2>Closed Cases</h2>

      {cases.map((c) => (
        <div key={c.case_id} className="expert-card">
          <h3>{c.case_title}</h3>
          <p>{c.client_name}</p>

          <button onClick={() => reopenCase(c.case_id)}>Reopen</button>
        </div>
      ))}
    </div>
  );
}

export default AdminClosedCases;