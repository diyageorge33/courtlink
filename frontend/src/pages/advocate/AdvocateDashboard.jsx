import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import { useNavigate } from "react-router-dom";

function AdvocateDashboard() {

  const navigate = useNavigate(); 
  const [stats, setStats] = useState({
    totalCases: 0,
    openCases: 0,
    weeklyCases: 0,
    clients: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userId = localStorage.getItem("user_id");

      const res = await axios.get(
        `http://localhost:5000/api/advocate/dashboard/${userId}`
      );
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

    return (
  <DashboardLayout role="advocate">
    

      <h1>Advocate Dashboard</h1>

      <div className="stats-grid">
        <StatCard title="Total Cases" value={stats.totalCases} />
        <StatCard title="Open Cases" value={stats.openCases} />
        <StatCard title="Cases Due This Week" value={stats.weeklyCases} />
        <StatCard title="Clients Managed" value={stats.clients} />
      </div>

      <div className="dashboard-row">
        <div className="card large-card">
          <h3>Upcoming Hearings</h3>
        </div>

        <div className="card large-card">
          <h3>Recent Activities</h3>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="card medium-card">
          <h3>Advanced Case Search</h3>
        </div>

        <div className="card medium-card">
          <h3>Client Management</h3>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="card medium-card">
          <h3>Document Management</h3>
        </div>

        <div className="card medium-card">
          <h3>Upcoming Reminders</h3>
        </div>
      </div>

  </DashboardLayout>
);

}

export default AdvocateDashboard;
