function AdvocatesView({ advocates, onBack, onDeleteAdvocate, onRestoreAdvocate }) {
  return (
    <div>
      <button className="dashboard-btn-new" onClick={onBack}>
        {"<-"} Back
      </button>

      <h2>Advocates</h2>

      <table className="cases-table-new">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Experience</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {advocates.map((advocate) => (
            <tr key={advocate.user_id}>
              <td>{advocate.full_name}</td>
              <td>{advocate.specialization}</td>
              <td>{advocate.experience_years} years</td>
              <td>{advocate.is_active ? "Active" : "Inactive"}</td>
              <td>
                {advocate.is_active ? (
                  <button
                    className="delete-btn-new"
                    onClick={() => onDeleteAdvocate(advocate.user_id)}
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    className="dashboard-btn-new"
                    onClick={() => onRestoreAdvocate(advocate.user_id)}
                  >
                    Restore
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdvocatesView;
