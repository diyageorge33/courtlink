function ClientCasesView({
  caseTimeline,
  clientCases,
  onBack,
  onCloseTimeline,
  onFetchTimeline,
  selectedCase,
  selectedClient,
}) {
  return (
    <div>
      <button className="dashboard-btn-new" onClick={onBack}>
        {"<-"} Back to Clients
      </button>

      {selectedClient && (
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ marginBottom: "5px" }}>{selectedClient.full_name}</h2>
          <p style={{ color: "#aaa" }}>{selectedClient.email}</p>
          <p style={{ color: "#aaa" }}>Phone: {selectedClient.phone || "N/A"}</p>
          <p style={{ color: "#aaa" }}>Address: {selectedClient.address || "N/A"}</p>
          <p style={{ color: "#aaa" }}>Gender: {selectedClient.gender || "N/A"}</p>
          <p style={{ color: "#aaa" }}>
            Date of Birth:{" "}
            {selectedClient.dob
              ? new Date(selectedClient.dob).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      )}

      <h3>Cases Filed</h3>

      {clientCases.length === 0 ? (
        <p style={{ color: "#aaa", marginTop: "15px" }}>
          No cases found for this client.
        </p>
      ) : (
        <table className="cases-table-new">
          <thead>
            <tr>
              <th>Case Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Assigned Advocate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clientCases.map((caseItem) => (
              <tr key={caseItem.case_id}>
                <td>{caseItem.case_title}</td>
                <td>{caseItem.case_type}</td>
                <td>{caseItem.status}</td>
                <td>{caseItem.advocate_name || "Not Assigned"}</td>
                <td>
                  <button
                    className="dashboard-btn-new"
                    style={{ padding: "5px 10px", fontSize: "12px" }}
                    onClick={() => onFetchTimeline(caseItem.case_id)}
                  >
                    View History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedCase && (
        <div
          style={{
            marginTop: "30px",
            background: "rgba(255,255,255,0.03)",
            padding: "20px",
            borderRadius: "10px",
            borderLeft: "4px solid #3b82f6",
            animation: "fadeIn 0.3s ease-in",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ margin: 0 }}>Case History Timeline</h3>
            <button
              className="delete-btn-new"
              style={{ padding: "5px 10px" }}
              onClick={onCloseTimeline}
            >
              Close
            </button>
          </div>

          {caseTimeline.length === 0 ? (
            <p style={{ color: "#94a3b8", margin: 0 }}>
              No history entries are available for this case yet.
            </p>
          ) : (
            <div style={{ position: "relative", paddingLeft: "30px" }}>
              <div
                style={{
                  position: "absolute",
                  left: "14px",
                  top: 0,
                  bottom: 0,
                  width: "2px",
                  background: "#334155",
                }}
              />
              {caseTimeline.map((step, index) => (
                <div
                  key={`${step.created_at}-${index}`}
                  style={{ position: "relative", marginBottom: "20px" }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "-21px",
                      top: "5px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background:
                        index === caseTimeline.length - 1 ? "#3b82f6" : "#64748b",
                      border: "3px solid #0f172a",
                      zIndex: 1,
                    }}
                  />
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color:
                        index === caseTimeline.length - 1 ? "#fff" : "#cbd5e1",
                    }}
                  >
                    {step.action}
                  </div>
                  <div
                    style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}
                  >
                    Done by {step.performed_by || "System"} |{" "}
                    {new Date(step.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ClientCasesView;
