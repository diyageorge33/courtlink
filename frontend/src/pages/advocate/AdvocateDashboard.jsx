import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import AdvocateSidebar from "../../components/AdvocateSidebar";
import { fetchAdvocateDashboardStats } from "../../api/advocateApi";
import "../../newstyles.css";

function AdvocateDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem("userName") || "Advocate";

  const [stats, setStats] = useState({
    totalCases: 0,
    openCases: 0,
    weeklyCases: 0,
    clients: 0,
  });

  const [loading, setLoading] = useState(true);

  // Check if we are exactly on /dashboard/advocate
  const isBaseRoute = location.pathname === "/dashboard/advocate";

  useEffect(() => {
  const loadStats = async () => {
    try {
      const advocateId = localStorage.getItem("user_id");

      if (!advocateId) {
        console.log("Advocate not logged in");
        return;
      }

      const data = await fetchAdvocateDashboardStats(advocateId);
      setStats(data);

    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  loadStats();
}, []);

  return (
    <div className="client-dashboard-new">
      <div className="dashboard-header-new">
        <div>
          <div className="welcome-header-new">
            <h1>Welcome, {userName}</h1>
          </div>
          <p>Here you can manage assigned cases and hearings.</p>
        </div>
      </div>

      {!loading && (
        <div className="stats-grid-new">
          <div className="stat-card-new">
            <h3>Total Cases</h3>
            <p>{stats.totalCases}</p>
          </div>

          <div className="stat-card-new">
            <h3>Ongoing Cases</h3>
            <p>{stats.openCases}</p>
          </div>

          <div className="stat-card-new">
            <h3>Cases This Week</h3>
            <p>{stats.weeklyCases}</p>
          </div>

          <div className="stat-card-new">
            <h3>Total Clients</h3>
            <p>{stats.clients}</p>
          </div>
        </div>
      )}

      <h2 className="section-title-new">Quick Actions</h2>

      <div className="actions-grid-new">
        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/advocate/addcase")}
        >
          <h3>Add New Case</h3>
          <p>Create a new case for a client.</p>
        </div>

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/advocate/cases")}
        >
          <h3>View My Cases</h3>
          <p>View all cases assigned to you.</p>
        </div>

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/advocate/hearings")}
        >
          <h3>Schedule Hearing</h3>
          <p>Schedule or update hearing dates.</p>
        </div>

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/advocate/uploadorder")}
        >
          <h3>Upload Order</h3>
          <p>Upload court orders and judgement documents.</p>
        </div>
      </div>
    </div>
  );
}

export default AdvocateDashboard;