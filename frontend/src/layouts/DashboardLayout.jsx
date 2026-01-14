import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function DashboardLayout({ children, role }) {
  return (
    <div className="dashboard-wrapper">
      <Sidebar role={role} />

      <div className="dashboard-main">
        <Topbar />
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
