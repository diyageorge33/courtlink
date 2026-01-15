import {  useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function VerifyOtp() {
  const navigate = useNavigate();

  const email = localStorage.getItem("pendingOtpEmail");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30); 
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("No pending email found. Please register again.");
      navigate("/register");
    }
  }, [email, navigate]);
   
  useEffect(() => {
        if (timer === 0) {
            setCanResend(true);
            return;
        }

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
  }, [timer]);


  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Email verified successfully");

    localStorage.removeItem("pendingOtpEmail");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  const handleResend = async () => {
    if (!canResend) return;

  try {
    const res = await fetch("http://localhost:5000/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("OTP resent to your email");
    setTimer(30);
    setCanResend(false);

  } catch {
    toast.error("Server error");
  }
};


  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Email Verification</h2>

        <p style={{ marginBottom: "12px", fontSize: "14px" }}>
          OTP sent to <strong>{email}</strong>
        </p>

        <input
          type="text"
          maxLength="6"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        />

        <button className="login-btn" onClick={handleVerify}>
          Verify OTP
        </button>
        {canResend ? (
            <p
                onClick={handleResend}
                style={{
                cursor: "pointer",
                color: "#2563eb",
                marginTop: "12px",
                fontSize: "14px",
                textAlign: "center",
                }}
            >
                Resend OTP
            </p>
            ) : (
            <p
                style={{
                marginTop: "12px",
                fontSize: "13px",
                color: "#6b7280",
                textAlign: "center",
                }}
            >
                Resend OTP in {timer}s
            </p>
        )}



      </div>
    </div>
  );
}

export default VerifyOtp;
