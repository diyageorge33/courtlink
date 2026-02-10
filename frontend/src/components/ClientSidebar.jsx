import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Menu</h3>

      <ul className="sidebar-links">
        <li onClick={() => navigate("/dashboard/client")}>Dashboard</li>
        <li onClick={() => navigate("/dashboard/client/aiassistant")}>AI Assistant</li>
        <li onClick={() => navigate("/dashboard/client/aisummarizer")}>AI Summarizer</li>
        <li onClick={() => navigate("/Mycase")}>My Cases</li>
        <li onClick={() => navigate("/Document")}>Documents</li>
        <li onClick={() => navigate("/Paymentshistory")}>Payment History</li>
        <li onClick={() => navigate("/Clientsetting")}>Settings</li>
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
