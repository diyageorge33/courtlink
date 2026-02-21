import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/AdvocateSidebar";
import { fetchAdvocateDashboardStats } from "../../api/advocateApi";
import { useEffect, useState } from "react";

function AdvocateDashboard() {
  const navigate = useNavigate();

  // ✅ FIXED STATE TO MATCH BACKEND RESPONSE
  const [stats, setStats] = useState({
    totalCases: 0,
    openCases: 0,
    weeklyCases: 0,
    clients: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const advocateId = localStorage.getItem("userId");

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
    <div className="client-layout">
      <Sidebar />

      <main className="client-content">
        <h1>Advocate Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome back! Here you can manage assigned cases and hearings.
        </p>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Cases</h3>
              <p>{stats.totalCases}</p>
            </div>

            <div className="stat-card">
              <h3>Ongoing Cases</h3>
              <p>{stats.openCases}</p>
            </div>

            <div className="stat-card">
              <h3>Cases This Week</h3>
              <p>{stats.weeklyCases}</p>
            </div>

            <div className="stat-card">
              <h3>Total Clients</h3>
              <p>{stats.clients}</p>
            </div>
          </div>
        )}

        <div className="dashboard-section">
          <h2>Quick Actions</h2>

          <div className="actions-grid">
            <div className="action-card">
              <h3>Add New Case</h3>
              <p>Create a new case for a client.</p>
              <button
                className="action-btn"
                onClick={() => navigate("/dashboard/advocate/addcase")}
              >
                Add Case
              </button>
            </div>

            <div className="action-card">
              <h3>View My Cases</h3>
              <p>View all cases assigned to you.</p>
              <button
                className="action-btn"
                onClick={() => navigate("/dashboard/advocate/cases")}
              >
                View
              </button>
            </div>

            <div className="action-card">
              <h3>Schedule Hearing</h3>
              <p>Schedule or update hearing dates.</p>
              <button
                className="action-btn"
                onClick={() => navigate("/dashboard/advocate/schedule")}
              >
                Schedule
              </button>
            </div>

            <div className="action-card">
              <h3>Upload Order</h3>
              <p>Upload court orders and judgement documents.</p>
              <button
                className="action-btn"
                onClick={() => navigate("/dashboard/advocate/uploadorder")}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdvocateDashboard;
