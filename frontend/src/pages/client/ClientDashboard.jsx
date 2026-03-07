

import { useNavigate } from "react-router-dom";
import { fetchClientDashboardStats } from "../../api/clientApi";
import PayConsultation from "../../components/PayConsultation";
import { useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";
import "../../newstyles.css";

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
          <h1>Welcome, {userName}</h1>
          <p>Manage your cases and legal documents.</p>
        </div>

        <FaCog
          className="settings-icon-new"
          onClick={() => navigate("/dashboard/client/clientsetting")}
        />

      </div>

      {/* STATS */}
      {!loading && (
        <div className="stats-grid-new">

          <div className="stat-card-new">
            <h3>Ongoing Cases</h3>
            <p>{stats.ongoingCases}</p>
          </div>

          <div className="stat-card-new">
            <h3>Upcoming Hearings</h3>
            <p>{stats.upcomingHearings}</p>
          </div>

          <div className="stat-card-new">
            <h3>Closed Cases</h3>
            <p>{stats.closedCases}</p>
          </div>

          <div className="stat-card-new">
            <h3>Pending Payments</h3>
            <p>₹ {stats.pendingPayments}</p>
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
          onClick={() => navigate("/dashboard/client/aiassistant")}
        >
          <h3>AI Assistant</h3>
          <p>Ask legal questions instantly.</p>
        </div>

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/client/document")}
        >
          <h3>My Documents</h3>
          <p>View and manage uploaded documents.</p>
        </div>

        <div className="action-tile-new"
        onClick={() => navigate("/dashboard/client/advocates")}>
           <h3>My Advocates</h3>
           <p>View your assigned advocates.</p>
      </div>

        
      </div>

    </div>
  );
}

export default ClientDashboard;