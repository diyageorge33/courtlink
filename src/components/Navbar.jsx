import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const isDashboard =
    location.pathname.startsWith("dashboard/client") ||
    location.pathname.startsWith("dashboard/advocate") ||
    location.pathname.startsWith("/admin-dashboard");

  return (
    <nav className="navbar">
      <div className="logo">⚖️CourtLink</div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/Services">Services</Link></li>
        <li><Link to="/CaseStatus">Case Status</Link></li>
        <li><Link to="/Help">Help</Link></li>
    </ul>


      {!isDashboard && (
    <button
  className="btn-primary"
  onClick={() => navigate("/login")}
>
  Login / Sign Up
</button>

)}

    </nav>
  );
}

export default Navbar;
