import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
const navigate = useNavigate();
const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      alert("Invalid credentials");
      return;
    }

    const data = await response.json();
    console.log("Login success:", data);

    // role-based redirect
    if (data.role === "CLIENT") {
      navigate("/dashboard/client");
    } else if (data.role === "ADVOCATE") {
      navigate("/dashboard/advocate");
    } else if (data.role === "ADMIN") {
      navigate("/admin-dashboard");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};


  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">⚖️</div>
          <h2>CourtLink</h2>
          <p>Your Link to Judicial Services.</p>
        </div>

        <div className="login-form">
          <label>Email address or Mobile number</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />


          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <a href="#" className="forgot-password">
            Forgot Password?
          </a>

          <div className="captcha">
            <input type="checkbox" />
            <span>I&apos;m not a robot</span>
          </div>

            <button
            type="button"
            className="login-btn"
            onClick={handleLogin}
          >
             Login
            </button>



          <p className="register-text">
            New user?{" "}
            <span onClick={() => navigate("/register")}>
            Register here
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
