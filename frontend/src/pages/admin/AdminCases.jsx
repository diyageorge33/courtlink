import { useEffect, useState } from "react";
import { fetchCases, fetchAdvocates, assignAdvocate } from "../../api/adminApi";
import "../../newstyles.css";
import { useNavigate } from "react-router-dom";

function AdminCases() {
  const [cases, setCases] = useState([]);
  const [advocates, setAdvocates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setCases(await fetchCases());
      setAdvocates(await fetchAdvocates());
    };
    load();
  }, []);

  const handleAssign = async (caseId, advocateId) => {
    await assignAdvocate({ caseId, advocateId });
    alert("Assigned!");
  };

  return (
    <div className="client-dashboard-new">
      <button onClick={() => navigate(-1)} className="dashboard-btn-new">← Back</button>
      <h2>Case Assignment</h2>

      {cases.map((c) => (
        <div key={c.case_id} className="expert-card">
          <h3>{c.case_title}</h3>
          <p>{c.client_name}</p>

          <select onChange={(e) => handleAssign(c.case_id, e.target.value)}>
            <option>Select Advocate</option>
            {advocates.map((a) => (
              <option key={a.user_id} value={a.user_id}>
                {a.full_name}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export default AdminCases;