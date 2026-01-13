import { Link } from "react-router-dom";
//Link allows navigation without page reload, keeping it fast and clean.

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>CourtLink</h4>
          <p>Your link to judicial services.</p>
        </div>


        <div className="footer-section">
        <h4>Services</h4>
        <p>
            <Link to="/track-case">Track Case Status</Link>
        </p>
        <p>
            <Link to="/orders">Download Orders</Link>
        </p>
        <p>
            <Link to="/advocate">Advocate Services</Link>
        </p>
        </div>


        <div className="footer-section">
            <h4>About</h4>
            <p>
                <Link to="/about">About Us</Link>
            </p>
            <p>
                <Link to="/privacy">Privacy Policy</Link>
            </p>
            <p>
                <Link to="/terms">Terms & Conditions</Link>
            </p>
        </div>


        <div className="footer-section">
          <h4>Support</h4>
          <p>Help Center</p>
          <p>Contact Us</p>
          <p>FAQs</p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 CourtLink. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
