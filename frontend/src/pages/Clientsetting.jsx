import { useNavigate } from "react-router-dom";
import Sidebar from "../components/ClientSidebar";

function Clientsetting() {
  const navigate = useNavigate();

  return (
    <div className="client-layout">
      <Sidebar />

      <main className="client-content">

        <h1>Settings</h1>
        <p className="dashboard-subtitle">
          Manage your account settings here.
        </p>

        <div className="settings-card">
          <h3>Profile Settings</h3>
          <p>View and update your personal details.</p>

          <button
            className="action-btn"
            onClick={() => navigate("/dashboard/client/clientprofile")}
          >
            Edit My Profile
          </button>
        </div>
      </main>
    </div>
  );
}

export default Clientsetting;
