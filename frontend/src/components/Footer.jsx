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
          <p>
                <Link to="/help">Help Center</Link>
            </p>
            <p>
                <Link to="/contact">Contact Us</Link>
            </p>
            <p>
                <Link to="/faq">FAQs</Link>
            </p>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 CourtLink. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
