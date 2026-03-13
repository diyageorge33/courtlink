import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../newstyles.css";

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
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login");
  };

  //Redirect home based on role
  const handleHomeClick = () => {

    const role = localStorage.getItem("role");

    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    if (role === "CLIENT") {
      navigate("/dashboard/client");
    } 
    else if (role === "ADVOCATE") {
      navigate("/dashboard/advocate");
    } 
    else if (role === "ADMIN") {
      navigate("/dashboard/admin");
    } 
    else {
      navigate("/");
    }
  };

  const isDashboardPage = location.pathname.startsWith("/dashboard");

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div 
        className="logo" 
        onClick={handleHomeClick}
        style={{ cursor: "pointer" }}
      >
        ⚖️ CourtLink
      </div>

      {/* NAV LINKS */}
      <ul className="nav-links">

        <li>
          <a onClick={handleHomeClick} style={{ cursor: "pointer" }}>
            Home
          </a>
        </li>

        <li>
          <Link to="/services">Services</Link>
        </li>

        <li>
          <Link to="/Legalexperts">Legal Experts</Link>
        </li>

        <li>
          <Link to="/help">Help</Link>
        </li>

      </ul>

      {/* AUTH SECTION */}
      {!isLoggedIn && !isDashboardPage ? (

        <div className="auth-links">
          <Link to="/login">Login</Link>
          <span className="separator"> / </span>
          <Link to="/register">Sign Up</Link>
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