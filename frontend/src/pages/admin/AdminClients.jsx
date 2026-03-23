import { useEffect, useState } from "react";
import "../../newstyles.css";
import { useNavigate } from "react-router-dom";
import { fetchClients } from "../../api/adminApi";

function AdminClients() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await fetchClients();
        setClients(data.clients);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };

    loadClients();
  }, []);

  return (
    <div className="client-dashboard-new">
      <button onClick={() => navigate(-1)} className="dashboard-btn-new">
        ← Back
      </button>

      <h2>Clients</h2>

      <table className="cases-table-new">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((c) => (
            <tr key={c.user_id}>
              <td
                style={{ cursor: "pointer", color: "#3b82f6" }}
                onClick={() => navigate(`/admin/client/${c.user_id}`)}
              >
                {c.full_name}
              </td>
              <td>{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminClients;