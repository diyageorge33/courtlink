function CaseReviewView({ onApprove, onBack, onReject, pendingCases }) {
  return (
    <div>
      <button className="dashboard-btn-new" onClick={onBack}>
        {"<-"} Back
      </button>

      <h2>Cases for Review</h2>

      <p style={{ color: "#aaa", marginBottom: "20px" }}>
        These cases have been filed by clients and are awaiting your approval.
      </p>

      {pendingCases.length === 0 ? (
        <p style={{ color: "#aaa", marginTop: "20px" }}>
          No cases currently awaiting review.
        </p>
      ) : (
        <table className="cases-table-new">
          <thead>
            <tr>
              <th>Client</th>
              <th>Case Title</th>
              <th>Type</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingCases.map((caseItem) => (
              <tr key={caseItem.case_id}>
                <td>{caseItem.client_name}</td>
                <td>{caseItem.case_title}</td>
                <td>{caseItem.case_type}</td>
                <td>{caseItem.case_description}</td>
                <td>
                  <button
                    className="dashboard-btn-new"
                    style={{ background: "#16a34a", marginRight: "5px" }}
                    onClick={() => onApprove(caseItem.case_id)}
                  >
                    Approve
                  </button>
                  <button
                    className="delete-btn-new"
                    onClick={() => onReject(caseItem.case_id)}
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

export default CaseReviewView;
