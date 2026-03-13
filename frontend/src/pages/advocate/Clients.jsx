import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../newstyles.css";

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(
          "http://localhost:5000/api/advocate/clients",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setClients(res.data);

      } catch (err) {
        console.error("Error fetching clients:", err);
        alert("Failed to load clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [navigate]);

  if (loading) {
    return (
      <div className="client-dashboard-new">
        <p style={{ color: "white", padding: "20px" }}>Loading clients...</p>
      </div>
    );
  }

  return (
    <div className="client-dashboard-new">

      <div className="documents-header-new">
        <h1 className="page-title-new">My Clients</h1>

        <div className="documents-header-buttons">
          <button
            className="dashboard-btn-new"
            onClick={() => navigate("/dashboard/advocate")}
          >
            ← Dashboard
          </button>
        </div>
      </div>

      <div className="table-container-new">
        <table className="custom-table-new">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((c) => (
              <tr key={c.user_id}>
                <td>{c.user_id}</td>
                <td className="bold-text">{c.full_name}</td>
                <td>{c.email}</td>
              </tr>
            ))}
          </tbody>

        </table>

        {clients.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "20px", color: "#94a3b8" }}>
            No clients found.
          </p>
        )}

      </div>
    </div>
  );
}

export default Clients;