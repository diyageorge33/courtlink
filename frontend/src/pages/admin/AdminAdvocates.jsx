import { useEffect, useState } from "react";
import { fetchAdvocates } from "../../api/adminApi";
import "../../newstyles.css";
import { useNavigate } from "react-router-dom";

function AdminAdvocates() {
  const [advocates, setAdvocates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await fetchAdvocates();
      setAdvocates(data);
    };
    load();
  }, []);

  return (
    <div className="client-dashboard-new">
      <button onClick={() => navigate(-1)} className="dashboard-btn-new">← Back</button>
      <h2>Advocates</h2>

      <table className="cases-table-new">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Experience</th>
          </tr>
        </thead>
        <tbody>
          {advocates.map((a) => (
            <tr key={a.user_id}>
              <td>{a.full_name}</td>
              <td>{a.specialization}</td>
              <td>{a.experience_years} yrs</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminAdvocates;