import { useNavigate,useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Menu</h3>

      <ul className="sidebar-links">
        <li 
          className={location.pathname === "/dashboard/client" ? "active" : ""}
          onClick={() => navigate("/dashboard/client")}
        >
          Dashboard
        </li>
        <li 
          className={location.pathname === "/dashboard/client/aiassistant" ? "active" : ""}
          onClick={() => navigate("/dashboard/client/aiassistant")}>AI Assistant</li>
        <li 
          className={location.pathname === "/dashboard/client/aisummarizer" ? "active" : ""}
          onClick={() => navigate("/dashboard/client/aisummarizer")}>AI Summarizer</li>
        <li 
          className={location.pathname === "/Mycase" ? "active" : ""}
          onClick={() => navigate("/Mycase")}>My Cases</li>
        <li 
          className={location.pathname === "/dashboard/client/document" ? "active" : ""}
          onClick={() => navigate("/dashboard/client/document")}>Documents</li>
        <li 
          className={location.pathname === "/dashboard/client/paymenthistory" ? "active" : ""}
          onClick={() => navigate("/dashboard/client/paymenthistory")}>Payment History</li>
        <li 
          className={location.pathname === "/dashboard/client/clientsetting" ? "active" : ""}
          onClick={() => navigate("/dashboard/client/clientsetting")}>Settings</li>
        <li
          onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
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
