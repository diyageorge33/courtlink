import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isDashboardPage = location.pathname.startsWith("/dashboard");

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        ⚖️ CourtLink
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/Legalexperts">Legal Experts</Link></li>
        <li><Link to="/help">Help</Link></li>
      </ul>

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