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

  return (
    <nav className="navbar">
      <div className="logo">⚖️ CourtLink</div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/case-status">Case Status</Link></li>
        <li><Link to="/help">Help</Link></li>
      </ul>

      {!isLoggedIn ? (
        // <button className="btn-primary" onClick={() => navigate("/login")}>
        //   Login / Sign Up
        // </button>
         <div className="auth-links">
          <span onClick={() => navigate("/login")}>Login</span>
          <span className="separator">/</span>
          <span onClick={() => navigate("/register")}>Sign Up</span>
        </div>

      ) : (
        <button className="btn-primary" onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;
