import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your registered email");
      return;
    }

    const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    res.ok ? toast.success(data.message) : toast.error(data.message);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">⚖️</div>
          <h2>Forgot Password</h2>
          <p>Enter your registered email to receive a reset link.</p>
        </div>

        <div className="login-form">
          <label>Email address</label>
          <input
            type="email"
            placeholder="Registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="login-btn" onClick={handleSubmit}>
            Send Reset Link
          </button>

          <p className="register-text">
            Remembered your password?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
