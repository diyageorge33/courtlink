function ClosedCasesView({ closedCases, onBack }) {
  return (
    <div>
      <button className="dashboard-btn-new" onClick={onBack}>
        {"<-"} Back
      </button>

      <h2>Closed Cases</h2>

      <table className="cases-table-new">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Client</th>
            <th>Advocate</th>
          </tr>
        </thead>
        <tbody>
          {closedCases.map((caseItem) => (
            <tr key={caseItem.case_id}>
              <td>{caseItem.case_id}</td>
              <td>{caseItem.case_title}</td>
              <td>{caseItem.case_type}</td>
              <td>{caseItem.client_name}</td>
              <td>{caseItem.advocate_name || "Not Assigned"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClosedCasesView;
