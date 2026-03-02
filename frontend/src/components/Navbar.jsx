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

  const linkStyle = {
    textDecoration: "none",
    color: "white",
    cursor: "pointer",
  };

  return (
    <nav className="navbar">

      {/* LOGO */}
      <Link to="/" className="logo" style={linkStyle}>
        ⚖️ CourtLink
      </Link>

      <ul className="nav-links">
        <li><Link to="/" style={linkStyle}>Home</Link></li>
        <li><Link to="/services" style={linkStyle}>Services</Link></li>
        <li><Link to="/Legalexperts" style={linkStyle}>Legal Experts</Link></li>
        <li><Link to="/help" style={linkStyle}>Help</Link></li>
      </ul>

      {!isLoggedIn && !isDashboardPage ? (
        <div className="auth-links">
          <Link to="/login" style={linkStyle}>Login</Link>
          <span className="separator" style={{ color: "white" }}> / </span>
          <Link to="/register" style={linkStyle}>Sign Up</Link>
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