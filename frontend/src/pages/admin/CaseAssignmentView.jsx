function CaseAssignmentView({
  advocates,
  caseSearch,
  cases,
  onAssignAdvocate,
  onBack,
  onCaseSearchChange,
  onCloseCase,
  onReassignAdvocate,
  onReopenCase,
  onStatusFilterChange,
  statusFilter,
}) {
  const filteredCases = cases.filter(
    (caseItem) =>
      (statusFilter === "ALL" || caseItem.status === statusFilter) &&
      (caseItem.case_title || "")
        .toLowerCase()
        .includes(caseSearch.toLowerCase())
  );

  return (
    <div>
      <button className="dashboard-btn-new" onClick={onBack}>
        {"<-"} Back
      </button>

      <h2>Case Assignment</h2>

      <input
        type="text"
        placeholder="Search cases..."
        value={caseSearch}
        onChange={(event) => onCaseSearchChange(event.target.value)}
        style={{ padding: "8px", width: "250px", marginBottom: "15px" }}
      />

      <select
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value)}
      >
        <option value="ALL">All Cases</option>
        <option value="PENDING">Pending</option>
        <option value="ONGOING">Ongoing</option>
        <option value="CLOSED">Closed</option>
        <option value="REJECTED">Rejected</option>
      </select>

      <table className="cases-table-new">
        <thead>
          <tr>
            <th>Case</th>
            <th>Client</th>
            <th>Status</th>
            <th>Assigned Advocate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCases.map((caseItem) => (
            <tr key={caseItem.case_id}>
              <td>{caseItem.case_title}</td>
              <td>{caseItem.client_name}</td>
              <td>{caseItem.status}</td>
              <td>
                {caseItem.status === "REJECTED" || caseItem.status === "CLOSED" ? (
                  <span>Not Allowed</span>
                ) : caseItem.status === "PENDING" ? (
                  <span style={{ color: "#ca8a04", fontWeight: "500" }}>
                    Needs Approval
                  </span>
                ) : caseItem.advocate_id ? (
                  <div>
                    <div style={{ marginBottom: "8px" }}>
                      Assigned: {caseItem.advocate_name}
                    </div>
                    <select
                      defaultValue="Reassign Advocate"
                      onChange={(event) =>
                        onReassignAdvocate(caseItem.case_id, event.target.value)
                      }
                    >
                      <option>Reassign Advocate</option>
                      {advocates
                        .filter(
                          (advocate) =>
                            advocate.is_active &&
                            String(advocate.user_id) !== String(caseItem.advocate_id)
                        )
                        .map((advocate) => (
                          <option key={advocate.user_id} value={advocate.user_id}>
                            {advocate.full_name} ({advocate.specialization})
                          </option>
                        ))}
                    </select>
                  </div>
                ) : (
                  <select
                    defaultValue="Select Advocate"
                    onChange={(event) =>
                      onAssignAdvocate(caseItem.case_id, event.target.value)
                    }
                  >
                    <option>Select Advocate</option>
                    {advocates
                      .filter((advocate) => advocate.is_active)
                      .map((advocate) => (
                        <option key={advocate.user_id} value={advocate.user_id}>
                          {advocate.full_name} ({advocate.specialization}){" "}
                          {advocate.specialization === caseItem.case_type
                            ? "Suggested"
                            : ""}
                        </option>
                      ))}
                  </select>
                )}
              </td>
              <td>
                {caseItem.status === "CLOSED" ? (
                  <button onClick={() => onReopenCase(caseItem.case_id)}>
                    Reopen
                  </button>
                ) : (
                  <button onClick={() => onCloseCase(caseItem.case_id)}>Close</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CaseAssignmentView;
