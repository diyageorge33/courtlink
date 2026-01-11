import Navbar from "../../components/Navbar";

import Sidebar from "../../components/Sidebar";

function ClientDashboard() {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-layout">
  
</div>

      <div className="dashboard-body">
        <Sidebar />

        <main className="dashboard-content">
          <h1>Welcome</h1>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Ongoing Cases</h3>
              <p>5</p>
            </div>

            <div className="stat-card">
              <h3>Upcoming Hearings</h3>
              <p>2</p>
            </div>

            <div className="stat-card">
              <h3>Closed Cases</h3>
              <p>12</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ClientDashboard;
