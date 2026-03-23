import { useEffect, useState } from "react";
import "../../newstyles.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  return (
    <div className="client-dashboard-new">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid-new">
        <div className="stat-card-new">
          <h3>Total Cases</h3>
          <p>{stats.totalCases}</p>
        </div>

        <div className="stat-card-new">
          <h3>Active Cases</h3>
          <p>{stats.activeCases}</p>
        </div>

        <div className="stat-card-new">
          <h3>Closed Cases</h3>
          <p>{stats.closedCases}</p>
        </div>

        <div className="stat-card-new">
          <h3>Total Advocates</h3>
          <p>{stats.totalAdvocates}</p>
        </div>
      </div>

      <div className="actions-grid-new">

        <div className="action-tile-new" onClick={() => navigate("/admin/clients")}>
          <h3>Clients</h3>
        </div>

        <div className="action-tile-new" onClick={() => navigate("/admin/advocates")}>
          <h3>Advocates</h3>
        </div>

        <div className="action-tile-new" onClick={() => navigate("/admin/review")}>
          <h3>Case Review</h3>
        </div>

        <div className="action-tile-new" onClick={() => navigate("/admin/cases")}>
          <h3>Case Assignment</h3>
        </div>

        <div className="action-tile-new" onClick={() => navigate("/admin/closed")}>
          <h3>Closed Cases</h3>
        </div>

        <div className="action-tile-new" onClick={() => navigate("/admin/analytics")}>
          <h3>Analytics</h3>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;