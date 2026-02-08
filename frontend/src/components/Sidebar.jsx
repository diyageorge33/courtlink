import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Menu</h3>

      <ul className="sidebar-links">
        <li onClick={() => navigate("/dashboard/client")}>Dashboard</li>
        <li onClick={() => navigate("/dashboard/client/aiassistant")}>AI Assistant</li>
        <li onClick={() => navigate("/track-case")}>My Cases</li>
        <li onClick={() => navigate("/orders")}>Documents</li>
        <li onClick={() => navigate("/services")}>Payment History</li>
        <li onClick={() => navigate("/privacy")}>Settings</li>
        <li
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
