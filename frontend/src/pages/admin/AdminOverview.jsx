function AdminOverview({ analyticsData, onNavigate, stats }) {
  return (
    <div>
      <div className="stats-grid-new">
        <div className="stat-card-new">
          <h3>Total Cases</h3>
          <p>{stats.totalCases}</p>
        </div>

        <div className="stat-card-new">
          <h3>Active Cases</h3>
          <p>{stats.activeCases}</p>
        </div>

        <div className="stat-card-new">
          <h3>Closed Cases</h3>
          <p>{stats.closedCases}</p>
        </div>

        <div className="stat-card-new">
          <h3>Total Advocates</h3>
          <p>{stats.totalAdvocates}</p>
        </div>
      </div>

      <div className="actions-grid-new">
        <div className="action-tile-new" onClick={() => onNavigate("clients")}>
          <h3>Clients</h3>
          <p>View registered clients</p>
        </div>

        <div className="action-tile-new" onClick={() => onNavigate("advocates")}>
          <h3>Advocates</h3>
          <p>{stats.totalAdvocates} registered advocates</p>
        </div>

        <div className="action-tile-new" onClick={() => onNavigate("pendingAdvocates")}>
          <h3>Registrations</h3>
          <p>Approve or reject advocate registrations</p>
        </div>

        <div className="action-tile-new" onClick={() => onNavigate("review")}>
          <h3>Case Review</h3>
          <p>{stats.pendingCases} cases pending</p>
        </div>

        <div className="action-tile-new" onClick={() => onNavigate("cases")}>
          <h3>Case Assignment</h3>
          <p>Assign advocates to cases</p>
        </div>

        <div className="action-tile-new" onClick={() => onNavigate("closedCases")}>
          <h3>Closed Cases</h3>
          <p>View completed cases</p>
        </div>

        <div className="action-tile-new" onClick={() => onNavigate("analytics")}>
          <h3>Analytics</h3>
          <p>Visual reports & trends</p>
        </div>

        <div className="action-tile-new" onClick={() => onNavigate("closures")}>
          <h3>Closures</h3>
          <p>Approve account closure requests</p>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>Recent Activity</h2>

        <div className="cases-table-wrapper-new" style={{ marginTop: "0" }}>
          {analyticsData?.recentActivity?.length > 0 ? (
            <table className="cases-table-new">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Case</th>
                  <th>By Admin</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.recentActivity.map((activity, index) => (
                  <tr key={index}>
                    <td>{activity.action}</td>
                    <td>{activity.case_title || "N/A"}</td>
                    <td>{activity.full_name}</td>
                    <td>{new Date(activity.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: "#94a3b8" }}>No recent activity recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
