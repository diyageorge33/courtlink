import { useEffect, useState } from "react";
import { fetchPendingCases, approveCase, rejectCase } from "../../api/adminApi";
import "../../newstyles.css";
import { useNavigate } from "react-router-dom";

function AdminReview() {
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setCases(await fetchPendingCases());
    };
    load();
  }, []);

  return (
    <div className="client-dashboard-new">
      <button onClick={() => navigate(-1)} className="dashboard-btn-new">← Back</button>
      <h2>Case Review</h2>

      {cases.map((c) => (
        <div key={c.case_id} className="expert-card">
          <h3>{c.case_title}</h3>
          <p>{c.client_name}</p>

          <button onClick={() => approveCase(c.case_id)}>Approve</button>
          <button onClick={() => rejectCase(c.case_id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}

export default AdminReview;