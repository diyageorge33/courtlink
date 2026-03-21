import { useNavigate } from "react-router-dom";
import { fetchClientDashboardStats } from "../../api/clientApi";
import PayConsultation from "../../components/PayConsultation";
import { useEffect, useState } from "react";
import { FaCog, FaRobot, FaGem, FaBell } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import "../../newstyles.css";

function ClientDashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Client");
  const [stats, setStats] = useState({
    ongoingCases: 0,
    upcomingHearings: 0,
    closedCases: 0,
    pendingPayments: 0,
  });

  const [consultationPaid, setConsultationPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔐 JWT decode for username
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setUserName(decoded.full_name || "Client");
    } catch (err) {
      console.error("Invalid token");
      setUserName("Client");
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchClientDashboardStats();
        setStats(data);

        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/payment/consultation-status",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const paymentData = await res.json();
        setConsultationPaid(paymentData.consultation_paid);

        setStats((prev) => ({
          ...prev,
          pendingPayments: paymentData.consultation_paid ? 0 : 500,
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="client-dashboard-new">

      {/* HEADER */}
      <div className="dashboard-header-new">

        <div>
          <div className="welcome-header-new">
            <h1>Welcome, {userName}</h1>

            {consultationPaid && (
              <span className="premium-badge-new">
                <FaGem className="diamond-icon" />
                Premium Member
              </span>
            )}
          </div>

          <p>Manage your cases and legal documents.</p>
        </div>

        {/* 🔥 ICON SECTION */}
        <div className="header-icons">

          

          <FaRobot
            className="ai-icon-new"
            onClick={() => navigate("/dashboard/client/aiassistant")}
          />

          {/* 🔔 NOTIFICATION BELL */}
          <FaBell
            className="notification-icon-new"
            onClick={() => navigate("/dashboard/client/notifications")}
          />

          <FaCog
            className="settings-icon-new"
            onClick={() => navigate("/dashboard/client/clientsetting")}
          />

        </div>

      </div>

      {/* STATS */}
      {!loading && (
        <div className="stats-grid-new">

          <div
            className="stat-card-new stat-green"
            onClick={() => navigate("/dashboard/client/ongoing")}
          >
            <h3>Ongoing Cases</h3>
            <p>{stats.ongoingCases}</p>
          </div>

          <div
            className="stat-card-new stat-yellow"
            onClick={() => navigate("/dashboard/client/hearings")}
          >
            <h3>Upcoming Hearings</h3>
            <p>{stats.upcomingHearings}</p>
          </div>

          <div
            className="stat-card-new stat-red"
            onClick={() => navigate("/dashboard/client/closed")}
          >
            <h3>Closed Cases</h3>
            <p>{stats.closedCases}</p>
          </div>

        </div>
      )}

      {/* CONSULTATION PAYMENT */}
      {!consultationPaid && (
        <div className="action-card-new">
          <h3>Consultation Fee Required</h3>
          <p>Pay ₹500 to unlock premium features.</p>
          <PayConsultation />
        </div>
      )}

      {/* QUICK ACTIONS */}
      <h2 className="section-title-new">Quick Actions</h2>

      <div className="actions-grid-new">

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/client/filecase")}
        >
          <h3>File Case</h3>
          <p>Submit a new legal case request.</p>
        </div>

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/client/aisummarizer")}
        >
          <h3>AI Summarizer</h3>
          <p>Summarize legal documents.</p>
        </div>

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/client/uploaddocuments")}
        >
          <h3>Upload Documents</h3>
          <p>Upload supporting documents.</p>
        </div>

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/client/paymenthistory")}
        >
          <h3>Payment History</h3>
          <p>View all your transactions.</p>
        </div>

        <div
          className={`action-tile-new ${!consultationPaid ? "tile-locked" : ""}`}
          onClick={() => consultationPaid && navigate("/Mycase")}
        >
          <h3>My Cases</h3>
          <p>
            {consultationPaid
              ? "Track the status of your cases."
              : "🔒 Premium Feature"}
          </p>
        </div>

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/client/orders")}
        >
          <h3>Download Orders</h3>
          <p>Access and download your case orders</p>
        </div>

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/client/document")}
        >
          <h3>My Documents</h3>
          <p>View and manage uploaded documents.</p>
        </div>

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/client/advocates")}
        >
          <h3>My Advocates</h3>
          <p>View your assigned advocates.</p>
        </div>

      </div>

    </div>
  );
}

export default ClientDashboard;