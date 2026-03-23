function ClientsView({ clients, onBack, onSelectClient }) {
  return (
    <div>
      <button className="dashboard-btn-new" onClick={onBack}>
        {"<-"} Back
      </button>

      <h2>Clients</h2>

      <table className="cases-table-new">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Case Names</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.user_id}>
              <td
                style={{ cursor: "pointer", color: "#3b82f6" }}
                onClick={() => onSelectClient(client)}
              >
                {client.full_name}
              </td>
              <td>{client.email}</td>
              <td>{client.case_names}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {clients.length === 0 && (
        <p style={{ color: "#94a3b8", marginTop: "20px" }}>
          No clients found.
        </p>
      )}
    </div>
  );
}

export default ClientsView;
