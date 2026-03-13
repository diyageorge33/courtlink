import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  fetchAdvocateDashboardStats,
  fetchAdvocateCases,
  fetchAdvocateClients
} from "../../api/advocateApi";
import "../../newstyles.css";

function AdvocateDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Advocate";

  const token = localStorage.getItem("token");

  let advocateId = null;

  if (token) {
    const decoded = jwtDecode(token);
    advocateId = decoded.user_id;
  }

  const [stats, setStats] = useState({
    totalCases: 0,
    openCases: 0,
    weeklyCases: 0,
    clients: 0,
  });

  const [loading, setLoading] = useState(true);
  const [detailMode, setDetailMode] = useState(null);
  const [detailData, setDetailData] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (!token) {
          navigate("/login");
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

  return (
    <div className="client-dashboard-new">

      <div className="dashboard-header-new">
        <div>
          <div className="welcome-header-new">
            <h1>Welcome, {userName}</h1>
          </div>
          <p>Here you can manage assigned cases and hearings.</p>
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
          onClick={() => navigate("/dashboard/advocate/hearings")}
        >
          <h3>Schedule Hearing</h3>
          <p>Schedule or update hearing dates.</p>
        </div>

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/advocate/uploadorder")}
        >
          <h3>Upload Order</h3>
          <p>Upload court orders and judgement documents.</p>
        </div>

      </div>

    </div>
  );
}

export default AdvocateDashboard;