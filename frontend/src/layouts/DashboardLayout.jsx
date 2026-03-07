import ClientSidebar from "../components/ClientSidebar";
import AdvocateSidebar from "../components/AdvocateSidebar";
import Topbar from "../components/Topbar";

function DashboardLayout({ children, role }) {

  const Sidebar = role === "advocate" ? AdvocateSidebar : ClientSidebar;

  return (
    <div className="dashboard-wrapper">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;