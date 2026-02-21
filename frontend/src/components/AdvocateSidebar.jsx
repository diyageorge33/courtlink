import { useNavigate } from "react-router-dom";

function AdvocateSidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Menu</h3>

      <ul className="sidebar-links">
        <li onClick={() => navigate("/dashboard/advocate")}>
          Dashboard
        </li>

        <li onClick={() => navigate("/dashboard/advocate/cases")}>
          My Cases
        </li>

        <li onClick={() => navigate("/dashboard/advocate/addcase")}>
          Add Case
        </li>

        <li onClick={() => navigate("/dashboard/advocate/schedule")}>
          Schedule Hearing
        </li>

        <li onClick={() => navigate("/dashboard/advocate/uploadorder")}>
          Upload Orders
        </li>

        <li onClick={() => navigate("/dashboard/advocate/clients")}>
          Clients
        </li>

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

export default AdvocateSidebar;
