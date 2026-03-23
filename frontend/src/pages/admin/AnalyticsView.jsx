function AnalyticsView({ analyticsData, onBack, stats }) {
  return (
    <div>
      <button className="dashboard-btn-new" onClick={onBack}>
        {"<-"} Back
      </button>

      <h2 style={{ marginTop: "20px" }}>System Analytics</h2>

      <div className="stats-grid-new" style={{ marginTop: "30px" }}>
        <div className="stat-card-new" style={{ textAlign: "left" }}>
          <h3>Case Status Distribution</h3>
          <div style={{ marginTop: "20px" }}>
            {analyticsData.statusStats.map((statusItem) => (
              <div key={statusItem.status} style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    marginBottom: "5px",
                  }}
                >
                  <span>{statusItem.status}</span>
                  <span>{statusItem.count} cases</span>
                </div>
                <div
                  style={{
                    height: "10px",
                    background: "#1e293b",
                    borderRadius: "5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      transition: "width 1s ease-in-out",
                      width: `${
                        (parseInt(statusItem.count, 10) / stats.totalCases) * 100
                      }%`,
                      background:
                        statusItem.status === "ONGOING"
                          ? "#3b82f6"
                          : statusItem.status === "PENDING"
                            ? "#ca8a04"
                            : statusItem.status === "CLOSED"
                              ? "#16a34a"
                              : "#ef4444",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card-new" style={{ textAlign: "left" }}>
          <h3>Case Type Distribution</h3>
          <div style={{ marginTop: "20px" }}>
            {analyticsData.typeStats.map((typeItem) => (
              <div key={typeItem.case_type} style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    marginBottom: "5px",
                  }}
                >
                  <span>{typeItem.case_type || "Other"}</span>
                  <span>{typeItem.count} cases</span>
                </div>
                <div
                  style={{
                    height: "10px",
                    background: "#1e293b",
                    borderRadius: "5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      transition: "width 1s ease-in-out",
                      width: `${
                        (parseInt(typeItem.count, 10) / stats.totalCases) * 100
                      }%`,
                      background: "#8b5cf6",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsView;
