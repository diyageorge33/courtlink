import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  fetchAdvocateDashboardStats,
  fetchAdvocateCases,
  fetchAdvocateClients,
  checkResignationStatus,
  submitResignationRequest,
  cancelResignationRequest,
  fetchProfile,
  uploadProfilePhoto,


} from "../../api/advocateApi";
import { toast } from "react-toastify";
import "../../newstyles.css";
import {FaCog} from "react-icons/fa";

function AdvocateDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Advocate";

  const token = localStorage.getItem("token");

  let advocateId = null;

  if (token) {
    try{
      const decoded = jwtDecode(token);
      advocateId = decoded.user_id;
    } catch (err) {
      console.error("Error decoding token:", err);
      navigate("/login");
    }
  }

  const [stats, setStats] = useState({
    totalCases: 0,
    openCases: 0,
    weeklyCases: 0,
    clients: 0,
  });
  const[profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailMode, setDetailMode] = useState(null);
  const [detailData, setDetailData] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Resignation states
  const [hasPendingResignation, setHasPendingResignation] = useState(false);
  const [showResignationModal, setShowResignationModal] = useState(false);
  const [resignationReason, setResignationReason] = useState("");
  const [resignationConfirm, setResignationConfirm] = useState(false);
  const [showCancelResignationModal, setShowCancelResignationModal] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        const[statsData, profileData, statusData] = await Promise.all([
          fetchAdvocateDashboardStats(advocateId),
          fetchProfile(),
          checkResignationStatus()
        ]);

        console.log("Fetched stats:", statsData);
        console.log("Fetched profile:", profileData);
        console.log("Fetched resignation status:", statusData);

        setStats(statsData);
        setProfile(profileData || {});
        setHasPendingResignation(statusData.hasPendingRequest);

      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        
        try{
          const profileData = await fetchProfile();
          setProfile(profileData || {});
        } catch (err) {
          console.error("Error fetching profile:", err);
          setProfile({});
        }
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [advocateId, token, navigate]);

  const handleStatClick = async (type) => {
    setDetailMode(type);
    setDetailLoading(true);

    try {
      let data = [];

      if (type === "total") {
        data = await fetchAdvocateCases(advocateId);

      } else if (type === "ongoing") {
        data = await fetchAdvocateCases(advocateId, { status: "ONGOING" });

      } else if (type === "weekly") {
        data = await fetchAdvocateCases(advocateId, { period: "week" });

      } else if (type === "clients") {
        data = await fetchAdvocateClients();
      }

      setDetailData(data);

    } catch (err) {
      console.error("Error fetching details:", err);

    } finally {
      setDetailLoading(false);
    }
  };

  const handleResignationSubmit = async () => {
    try {
      await submitResignationRequest(resignationReason);
      toast.success("Resignation request submitted successfully.");
      setShowResignationModal(false);
      setHasPendingResignation(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit resignation request.");
    }
  };

  const handleCancelClick = () => {
    setShowCancelResignationModal(true);
  };

  const confirmCancelResignation = async () => {
    try {
      await cancelResignationRequest();
      toast.success("Resignation request formally cancelled.");
      setHasPendingResignation(false);
      setResignationReason("");
      setResignationConfirm(false);
      setShowCancelResignationModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel request.");
    }
  };

  return (
    <div className="client-dashboard-new">

      <div className="dashboard-header-new">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>

            <div style={{ display: "flex", alignItems: "center",  gap: "15px" }}>

              {/* Profile Image */}
              <div style={{ position: "relative" }}>
                <img
                  src={
                    profile && profile.profile_image
                      ? `http://localhost:5000/uploads/${profile.profile_image}`
                      : `https://ui-avatars.com/api/?name=${userName}`
                  }
                  alt="profile"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    cursor: "pointer",
                    border: "3px solid #6366f1"
                  }}
                  onClick={() => document.getElementById("profileUpload").click()}
                />

                {/* Hidden Upload Input */}
                <input
                  id="profileUpload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    try {
                      await uploadProfilePhoto(file);
                      toast.success("Profile updated!");

                      const updated = await fetchProfile();
                      setProfile(updated);

                    } catch (err) {
                      toast.error("Upload failed");
                    }
                  }}
                />
              </div>

              {/* Welcome Text */}
                  <div>
                    <div className="welcome-header-new" style={{ marginBottom: "4px" }}>
                      <h1 style={{ margin: 0 }}>Welcome Adv. {userName}!</h1>
                    </div>
                    <p style={{ marginTop: 0 }}>
                      A centralized workspace to manage cases, hearings, and legal responsibilities.
                    </p>
                  </div>

            </div>
            <FaCog
              style={{
                fontSize: "22px",
                color: "#94a3b8",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
              onClick={() => navigate("/dashboard/advocate/settings")}
            />
        </div>
      </div>


      {!loading && (
        <div className="stats-grid-new">

          <div
            className={`stat-card-new clickable-stat ${detailMode === "total" ? "active" : ""}`}
            onClick={() => handleStatClick("total")}
          >
            <h3>Total Cases</h3>
            <p>{stats.totalCases}</p>
          </div>

          <div
            className={`stat-card-new clickable-stat ${detailMode === "ongoing" ? "active" : ""}`}
            onClick={() => handleStatClick("ongoing")}
          >
            <h3>Ongoing Cases</h3>
            <p>{stats.openCases}</p>
          </div>

          <div
            className={`stat-card-new clickable-stat ${detailMode === "weekly" ? "active" : ""}`}
            onClick={() => handleStatClick("weekly")}
          >
            <h3>Cases This Week</h3>
            <p>{stats.weeklyCases}</p>
          </div>

          <div
            className={`stat-card-new clickable-stat ${detailMode === "clients" ? "active" : ""}`}
            onClick={() => handleStatClick("clients")}
          >
            <h3>Total Clients</h3>
            <p>{stats.clients}</p>
          </div>

        </div>
      )}

      {detailMode && (
        <div className="detail-view-container-new anim-fade-in">

          <div className="detail-view-header-new">
            <h2>
              {detailMode === "total" && "All Assigned Cases"}
              {detailMode === "ongoing" && "Ongoing Cases"}
              {detailMode === "weekly" && "Cases Added This Week"}
              {detailMode === "clients" && "Your Clients"}
            </h2>

            <button
              className="close-details-btn"
              onClick={() => setDetailMode(null)}
            >
              Close Details ×
            </button>
          </div>

          {detailLoading ? (
            <div className="loading-spinner-simple">
              Loading items...
            </div>

          ) : (
            <div className="table-container-new">
              <table className="custom-table-new">

                {detailMode === "clients" ? (

                  <>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Client Name</th>
                        <th>Email Address</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {detailData.map((client, idx) => (
                        <tr key={client.user_id}>
                          <td>{idx + 1}</td>
                          <td className="bold-text">{client.full_name}</td>
                          <td>{client.email}</td>

                          <td style={{ textAlign: "right" }}>
                            <button
                              className="icon-btn-view"
                              onClick={() =>
                                navigate(`/dashboard/advocate/addcase?clientId=${client.user_id}`)
                              }
                            >
                              New Case
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>

                ) : (

                  <>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Case Title</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {detailData.map((c, idx) => (
                        <tr key={c.case_id}>
                          <td>{idx + 1}</td>
                          <td className="bold-text">{c.case_title}</td>
                          <td>{c.case_type}</td>

                          <td>
                            <span className={`status-pill ${c.status.toLowerCase()}`}>
                              {c.status}
                            </span>
                          </td>

                          <td style={{ textAlign: "right" }}>
                            <button
                              className="icon-btn-view"
                              onClick={() =>
                                navigate(`/dashboard/advocate/case/${c.case_id}`)
                              }
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

              </table>

              {detailData.length === 0 && (
                <p style={{ textAlign: "center", color: "#94a3b8", marginTop: "20px" }}>
                  No records found.
                </p>
              )}
            </div>
          )}

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
          onClick={() => navigate("/dashboard/advocate/schedules")}
        >
          <h3>My Schedules</h3>
          <p>Add busy dates and calendar reminders.</p>
        </div>

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/advocate/uploadorder")}
        >
          <h3>Upload Order</h3>
          <p>Upload court orders and judgement documents.</p>
        </div>

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/advocate/appointments")}
        >
          <h3>Appointments</h3>
          <p>View client bookings and consultation details.</p>
        </div>

      </div>

      {/* Floating Resignation Button */}
      {!hasPendingResignation ? (
        <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 1000 }}>
          <button 
            className="btn-danger" 
            style={{ borderRadius: "50px", padding: "12px 24px", boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)", fontWeight: "600", cursor: "pointer", border: "none", background: "#ef4444", color: "white" }}
            onClick={() => setShowResignationModal(true)}
          >
            Request Account Closure
          </button>
        </div>
      ) : (
        <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 1000, display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
          <div style={{ background: "#475569", color: "white", padding: "12px 24px", borderRadius: "50px", fontSize: "14px", fontWeight: "600", boxShadow: "0 4px 15px rgba(0,0,0,0.5)" }}>
            Closure Requested (Pending)
          </div>
          <button 
            style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "6px 16px", borderRadius: "50px", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            onClick={handleCancelClick}
          >
            Cancel Request
          </button>
        </div>
      )}

      {/* Resignation Modal Overlay */}
      {showResignationModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-card" style={{ maxWidth: "500px", textAlign: "left" }}>
            <h3 style={{ marginBottom: "15px", color: "#ef4444" }}>Request Account Closure</h3>
            <p style={{ fontSize: "14px", color: "#cbd5e1", marginBottom: "20px" }}>
              Are you sure you want to close your advocate account? All your existing and pending cases will be reassigned to other advocates by the administrator.
            </p>
            
            <label style={{ display: "block", margin: "0 0 8px 0", fontSize: "14px", color: "#94a3b8" }}>Reason for Resignation</label>
            <textarea 
              style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "#0f172a", color: "white", border: "1px solid #334155", minHeight: "80px", marginBottom: "20px", boxSizing: "border-box", fontFamily: "inherit" }}
              value={resignationReason}
              onChange={(e) => setResignationReason(e.target.value)}
              placeholder="Please provide a brief reason..."
            />

            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "25px", background: "rgba(15, 23, 42, 0.4)", padding: "12px", borderRadius: "8px", border: "1px solid #334155" }}>
              <input 
                type="checkbox" 
                checked={resignationConfirm} 
                onChange={(e) => setResignationConfirm(e.target.checked)} 
                style={{ cursor: "pointer", width: "18px", height: "18px" }}
              />
              <span style={{ fontSize: "13px", color: "#cbd5e1" }}>I understand that my pending cases will be reassigned.</span>
            </label>

            <div className="custom-modal-actions">
              <button className="btn-secondary" onClick={() => setShowResignationModal(false)}>Cancel</button>
              <button 
                className="btn-danger" 
                disabled={!resignationReason.trim() || !resignationConfirm}
                style={{ opacity: (!resignationReason.trim() || !resignationConfirm) ? 0.5 : 1 }}
                onClick={handleResignationSubmit}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Resignation Modal Overlay */}
      {showCancelResignationModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-card" style={{ maxWidth: "450px" }}>
            <h3 style={{ marginBottom: "15px", color: "white" }}>Cancel Resignation?</h3>
            <p style={{ fontSize: "14px", color: "#cbd5e1", margin: "0 0 25px 0" }}>
              Are you sure you want to continuously keep your account open and cancel the closure request?
            </p>
            <div className="custom-modal-actions">
              <button className="btn-secondary" onClick={() => setShowCancelResignationModal(false)}>Discard</button>
              <button className="btn-danger" onClick={confirmCancelResignation}>Accept</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdvocateDashboard;