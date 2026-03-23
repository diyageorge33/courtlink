
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CLIENT");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(""); // ✅ added back

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!phone || phone.length < 10) {
      toast.error("Enter valid phone number");
      return;
    }

    if (!dob) {
      toast.error("Date of birth is required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmPassword,
          role,
          phone,
          dob, // ✅ send DOB
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("OTP sent to your email");

      localStorage.setItem("pendingOtpEmail", email);

      setTimeout(() => {
        navigate("/verify-otp");
      }, 1500);

    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="info-page">
      <div className="info-container">
        <div className="register-header">
          <div className="register-logo">⚖️</div>
          <h2>Create Your Account</h2>
          <p>Join CourtLink to connect with legal professionals or clients.</p>
        </div>

        <div className="register-form">
          <label>I am *</label>
          <select
            value={role}
            onChange={(e) => {
              const selectedRole = e.target.value;
              setRole(selectedRole);

              if (selectedRole === "ADVOCATE") {
                navigate("/register/advocate");
              }
            }}
          >
            <option value="CLIENT">Client</option>
            <option value="ADVOCATE">Advocate</option>
          </select>

          <div className="two-column">
            <div>
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label>Email Address *</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="two-column">
            <div>
              <label>Phone Number *</label>
              <input
                type="tel"
                placeholder="+91"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label>Date of Birth *</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          </div>

          <div className="two-column">
            <div>
              <label>Password *</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label>Confirm Password *</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            className="register-btn"
            onClick={handleRegister}
          >
            Register
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

export default Register;