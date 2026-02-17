import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleHomeClick = () => {
    const role = localStorage.getItem("role");

    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    if (role === "CLIENT") {
      navigate("/dashboard/client");
    } else if (role === "ADVOCATE") {
      navigate("/dashboard/advocate");
    } else if (role === "ADMIN") {
      navigate("/dashboard/admin");
    } else {
      navigate("/");
    }
  };

  const isDashboardPage = location.pathname.startsWith("/dashboard");

  return (
    <nav className="navbar">
      
      {/* LOGO */}
      <div className="logo" onClick={handleHomeClick} style={{ cursor: "pointer" }}>
        ⚖️ CourtLink
      </div>

      {/* NAV LINKS */}
      <ul className="nav-links">
        <li>
          <a onClick={handleHomeClick} style={{ cursor: "pointer" }}>
            Home
          </a>
        </li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/Legalexperts">Legal Experts</Link></li>
        <li><Link to="/help">Help</Link></li>
      </ul>

      {/* RIGHT SIDE */}
      {!isLoggedIn && !isDashboardPage ? (
        <div className="auth-links">
          <span onClick={() => navigate("/login")}>Login</span>
          <span className="separator">/</span>
          <span onClick={() => navigate("/register")}>Sign Up</span>
        </div>
      ) : isLoggedIn ? (
        <button className="btn-primary" onClick={handleLogout}>
          Logout
        </button>
      ) : null}
    </nav>
  );
}

export default Navbar;
