function Sidebar({ role }) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo">⚖️ CourtLink</h2>

      <nav>
        <ul>
          <li>Dashboard</li>

          {role === "client" && (
            <>
              <li>My Cases</li>
              <li>Advocate Services</li>
              <li>Notifications</li>
            </>
          )}

          {role === "advocate" && (
            <>
              <li>My Cases</li>
              <li>Clients</li>
              <li>Calendar</li>
              <li>Case Search</li>
              <li>Documents</li>
            </>
          )}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <p>Settings</p>
        <p>Logout</p>
      </div>
    </aside>
  );
}

export default Sidebar;
