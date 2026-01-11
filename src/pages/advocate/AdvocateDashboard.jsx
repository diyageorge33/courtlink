import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";

function AdvocateDashboard() {
  return (
    <DashboardLayout role="advocate">
      <h2>Welcome Back!</h2>

      <div className="stats-grid">
        <StatCard title="Total Cases" value="185" />
        <StatCard title="Open Cases" value="92" />
        <StatCard title="Cases This Week" value="14" />
        <StatCard title="Clients Managed" value="58" />
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
            <li>Case CV-2024-0345 updated</li>
            <li>New hearing scheduled</li>
            <li>Document uploaded</li>
          </ul>
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
