function PendingAdvocatesView({ advocates, onApprove, onBack, onReject }) {
  return (
    <div>
      <button className="dashboard-btn-new" onClick={onBack}>
        {"<-"} Back
      </button>

      <h2>Pending Advocate Registrations</h2>

      {advocates.length === 0 ? (
        <p style={{ color: "#94a3b8", marginTop: "20px" }}>
          No pending advocate registrations.
        </p>
      ) : (
        <table className="cases-table-new">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Office ID</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {advocates.map((advocate) => (
              <tr key={advocate.id}>
                <td>{advocate.full_name}</td>
                <td>{advocate.email}</td>
                <td>{advocate.office_id}</td>
                <td>{advocate.specialization}</td>
                <td>{advocate.experience_years} yrs</td>
                <td>
                  <button
                    className="dashboard-btn-new"
                    style={{ background: "#16a34a", marginRight: "8px" }}
                    onClick={() => onApprove(advocate.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="delete-btn-new"
                    onClick={() => onReject(advocate.id)}
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

export default PendingAdvocatesView;
