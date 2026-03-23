function ClosureRequestsView({
  advocateClosures,
  clientClosures,
  onApproveAdvocate,
  onApproveClient,
  onBack,
  onRejectAdvocate,
  onRejectClient,
}) {
  return (
    <div>
      <button className="dashboard-btn-new" onClick={onBack}>
        {"<-"} Back
      </button>

      <h2>Account Closure Requests</h2>

      <h3 style={{ marginTop: "24px" }}>Client Closures</h3>
      {clientClosures.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No pending client closure requests.</p>
      ) : (
        <table className="cases-table-new">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clientClosures.map((client) => (
              <tr key={client.user_id}>
                <td>{client.full_name}</td>
                <td>{client.email}</td>
                <td>{client.account_status}</td>
                <td>
                  <button
                    className="dashboard-btn-new"
                    style={{ background: "#16a34a", marginRight: "8px" }}
                    onClick={() => onApproveClient(client.user_id)}
                  >
                    Approve
                  </button>
                  <button
                    className="delete-btn-new"
                    onClick={() => onRejectClient(client.user_id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 style={{ marginTop: "32px" }}>Advocate Closures</h3>
      {advocateClosures.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No pending advocate closure requests.</p>
      ) : (
        <table className="cases-table-new">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Reason</th>
              <th>Requested At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {advocateClosures.map((advocate) => (
              <tr key={advocate.user_id}>
                <td>{advocate.full_name}</td>
                <td>{advocate.email}</td>
                <td>{advocate.reason || "N/A"}</td>
                <td>
                  {advocate.requested_at
                    ? new Date(advocate.requested_at).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  <button
                    className="dashboard-btn-new"
                    style={{ background: "#16a34a", marginRight: "8px" }}
                    onClick={() => onApproveAdvocate(advocate.user_id)}
                  >
                    Approve
                  </button>
                  <button
                    className="delete-btn-new"
                    onClick={() => onRejectAdvocate(advocate.user_id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ClosureRequestsView;
