import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/ClientSidebar";
import { fetchClientDashboardStats } from "../../api/clientApi";
import PayConsultation from "../../components/PayConsultation";
import { useEffect, useState } from "react";

function ClientDashboard() {
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "Client";

  const [stats, setStats] = useState({
    ongoingCases: 0,
    upcomingHearings: 0,
    closedCases: 0,
    pendingPayments: 0,
  });

  const [consultationPaid, setConsultationPaid] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadData = async () => {
      try {
        const clientId = localStorage.getItem("userId");

        if (!clientId) {
          console.log("Client not logged in");
          return;
        }

        // Load dashboard stats
        const statsData = await fetchClientDashboardStats(clientId);
        setStats(statsData);

        // Check consultation payment status
        const res = await fetch(
          `http://localhost:5000/api/payment/consultation-status/${clientId}`
        );
        const paymentData = await res.json();
        setConsultationPaid(paymentData.paid);

      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="client-layout">
      <Sidebar />

      <main className="client-content">
        <div className="welcome-header">
          <h1>Welcome, {userName}!</h1>

          {consultationPaid && (
            <span className="premium-badge">
              💎 Premium Member
            </span>
          )}
      </div>

        <p className="dashboard-subtitle">
          Here you can manage your cases, documents, and payments.
        </p>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Ongoing Cases</h3>
              <p>{stats.ongoingCases}</p>
            </div>

            <div className="stat-card">
              <h3>Upcoming Hearings</h3>
              <p>{stats.upcomingHearings}</p>
            </div>

            <div className="stat-card">
              <h3>Closed Cases</h3>
              <p>{stats.closedCases}</p>
            </div>

            <div className="stat-card">
              <h3>Pending Payments</h3>
              <p>₹ {stats.pendingPayments}</p>
            </div>
          </div>
        )}

        {/*  Consultation Payment Section */}
        {!consultationPaid && (
          <div className="action-card" style={{ marginBottom: "20px" }}>
            <h3>Consultation Fee Required</h3>
            <p>Please pay ₹500 to unlock advanced features.</p>
            <PayConsultation clientId={localStorage.getItem("userId")} />
          </div>
        )}

        <div className="dashboard-section">
          <h2>Quick Actions</h2>

          <div className="actions-grid">
            <div className="action-card">
              <h3>File a New Case Request</h3>
              <p>Submit a new legal case request to the firm.</p>
              <button
                className="action-btn"
                onClick={() => navigate("/dashboard/client/filecase")}
              >
                File Case
              </button>
            </div>

            <div className="action-card">
              <h3>Track Case Status</h3>
              <p>Check updates and current progress of your cases.</p>
              <button
                  className={`action-btn ${!consultationPaid ? "unlocked" : ""}`}
                  disabled={!consultationPaid}
                  onClick={() => navigate("/dashboard/client/mycases")}
                >
                  {consultationPaid ? "Track" : "🔒 Track (Premium)"}
                </button>
            </div>

            <div className="action-card">
              <h3>Upload Documents</h3>
              <p>Upload supporting documents for your case.</p>
              <button
                className="action-btn"
                onClick={() => navigate("/dashboard/client/uploaddocuments")}
              >
                Upload
              </button>
            </div>

            <div className="action-card">
              <h3>Download Orders</h3>
              <p>Download court orders and judgement documents.</p>
              <button
                className={`action-btn ${!consultationPaid ? "unlocked" : ""}`}
                disabled={!consultationPaid}
                onClick={() => navigate("/dashboard/client/downloadorders")}
              >
                {consultationPaid ? "Download" : "🔒 Download (Premium)"}
            </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ClientDashboard;