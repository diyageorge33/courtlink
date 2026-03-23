import { useEffect, useState } from "react";
import { fetchClientCases } from "../../api/adminApi";
import { useParams, useNavigate } from "react-router-dom";
import "../../newstyles.css";

function AdminClientCases() {
  const { clientId } = useParams();
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setCases(await fetchClientCases(clientId));
    };
    load();
  }, [clientId]);

  return (
    <div className="client-dashboard-new">
      <button onClick={() => navigate(-1)} className="dashboard-btn-new">← Back</button>
      <h2>Client Cases</h2>

      {cases.map((c) => (
        <div key={c.case_id} className="expert-card">
          <h3>{c.case_title}</h3>
          <p>Status: {c.status}</p>
          <p>Advocate: {c.advocate_name}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminClientCases;