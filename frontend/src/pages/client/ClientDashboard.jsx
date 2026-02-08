import Sidebar from "../../components/Sidebar";

function ClientDashboard() {
  return (
    <div className="dashboard-body">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Client Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome back! Here you can manage your cases, documents, and payments.
        </p>

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

          <div className="stat-card">
            <h3>Pending Payments</h3>
            <p>₹ 1500</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Quick Actions</h2>

          <div className="actions-grid">
            <div className="action-card">
              <h3>File a New Case</h3>
              <p>Submit a new legal case request to the firm.</p>
              <button className="action-btn">File Case</button>
            </div>

            <div className="action-card">
              <h3>Track Case Status</h3>
              <p>Check updates and current progress of your cases.</p>
              <button className="action-btn">Track</button>
            </div>

            <div className="action-card">
              <h3>Upload Documents</h3>
              <p>Upload supporting documents for your case.</p>
              <button className="action-btn">Upload</button>
            </div>

            <div className="action-card">
              <h3>Download Orders</h3>
              <p>Download court orders and judgement documents.</p>
              <button className="action-btn">Download</button>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Case Updates</h2>

          <div className="case-updates">
            <div className="case-update-card">
              <h4>Case ID: CL1023</h4>
              <p>Status: Hearing Scheduled</p>
              <p>Next Date: 15 Feb 2026</p>
            </div>

            <div className="case-update-card">
              <h4>Case ID: CL1020</h4>
              <p>Status: Advocate Assigned</p>
              <p>Advocate: Adv. Rahul Menon</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ClientDashboard;
