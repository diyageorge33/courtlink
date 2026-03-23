import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

function Login() {
const navigate = useNavigate();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [captchaToken, setCaptchaToken] = useState(null);
const captchaRef = useRef(null);

const handleLogin = async (e) => {
  e.preventDefault();

  if (!RECAPTCHA_SITE_KEY) {
    toast.error("reCAPTCHA site key is missing");
    return;
  }

  if (!captchaToken) {
    toast.error("Please verify reCAPTCHA");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        captchaToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.message === "Login failed on the server" && errorData.error
          ? errorData.error
          : errorData.message || errorData.error || "Login failed";
      toast.error(errorMessage);
      captchaRef.current.reset();
      setCaptchaToken(null);
      return;
      
    }

    const data = await response.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("userName", data.full_name);

    if (data.role === "CLIENT") {
      navigate("/dashboard/client");
    } else if (data.role === "ADVOCATE") {
      navigate("/dashboard/advocate");
    } else if (data.role === "ADMIN") {
      navigate("/dashboard/admin");
    }
  } catch (err) {
    console.error(err);
    toast.error("Server error. Please try again.");

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
          <label>Email address </label>
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


          <span
            className="forgot-password"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>

          
          {/* reCAPTCHA */}
          <div className="mb-3 d-flex justify-content-center">
            <ReCAPTCHA
              ref={captchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={(token) => setCaptchaToken(token)}
              onExpired={() => setCaptchaToken(null)}
              onErrored={() => {
                setCaptchaToken(null);
                toast.error("reCAPTCHA failed to load");
              }}
            />
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
