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
      <h2>Welcome Back!</h2>

      <div className="stats-grid">
        <StatCard title="Total Cases" value={stats.totalCases} />
        <StatCard title="Open Cases" value={stats.openCases} />
        <StatCard title="Cases This Week" value={stats.weeklyCases} />
        <StatCard title="Clients Managed" value={stats.clients} />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Upcoming Hearings</h3>
          <p>View upcoming court schedules</p>
          <button>View All</button>
        </div>

        <div className="card">
          <h3>Recent Activities</h3>
          <ul>
            <li>Case updated</li>
            <li>New hearing scheduled</li>
            <li>Document uploaded</li>
          </ul>
        </div>

        <div className="card">
         <h3>My Cases</h3>
          <p>View and manage your assigned cases</p>
          <button onClick={() => navigate("/dashboard/advocate/cases")}>
            View Cases
          </button>
        </div>

        <div className="card">
          <h3>Advanced Case Search</h3>
          <input placeholder="Case Number" />
          <input placeholder="Client Name" />
          <button>Search Case</button>
        </div>

        <div className="card">
          <h3>Document Management</h3>
          <p>Upload or browse case documents</p>
          <button>Upload Document</button>
        </div>

        <div className="card">
          <h3>Upcoming Reminders</h3>
          <ul>
            <li>Evidence submission deadline</li>
            <li>Client meeting</li>
            <li>Court hearing</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdvocateDashboard;
