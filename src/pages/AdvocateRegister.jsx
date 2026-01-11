import { useNavigate } from "react-router-dom";

function AdvocateRegister() {
  const navigate = useNavigate();

  return (
    <div className="info-page">
      <div className="info-container">
        {/* Header */}
        <div className="register-header">
          <div className="register-logo">⚖️</div>
          <h2>Advocate Registration</h2>
          <p>
            Join CourtLink as an Advocate to manage your cases efficiently.
          </p>
        </div>


        {/* FORM */}
        <div className="register-form">
          <label>Full Name *</label>
          <input type="text" placeholder="Enter your full name" />

          <label>Email Address *</label>
          <input type="email" placeholder="Enter your email address" />

          <label>Phone Number *</label>
          <input type="tel" placeholder="+1 (555) 123-4567" />

          <label>Employee ID (Firm ID)</label>
          <input
            type="text"
            placeholder="Enter your employee or firm ID"
          />
          

          <label>Bar Enrollment Number *</label>
          <input type="text" placeholder="e.g., AB123456" />

          <label>Years of Experience *</label>
          <input type="number" placeholder="Enter your years of experience" />

          {/* Case Specialization */}
          <p className="section-label">Case Type Specialization *</p>

<div className="checkbox-grid">
  {[
    "Criminal",
    "Civil",
    "Family",
    "Corporate",
    "Commercial",
    "Labour",
    "Consumer",
    "Constitutional",
    "Taxation",
    "Intellectual Property",
    "Cyber Law",
    "Environmental",
    "Arbitration & Mediation",
    "Other",
  ].map((item) => (
    <label className="checkbox-item" key={item}>
      <input type="checkbox" />
      <span>{item}</span>
    </label>
  ))}
</div>





          <button className="register-btn">
            Register
            {/* BACKEND: POST /api/auth/register/advocate */}
          </button>

          <p className="login-redirect">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdvocateRegister;
