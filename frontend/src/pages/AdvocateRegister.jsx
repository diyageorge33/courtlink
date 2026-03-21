import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

function AdvocateRegister() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [officeId, setOfficeId] = useState(""); // ✅ CHANGED
  const [experienceYears, setExperienceYears] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [role, setRole] = useState("ADVOCATE");

  const specializationList = [
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
  ];

  const handleCheckboxChange = (value) => {
    setSpecializations((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleRegister = async () => {
    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !officeId ||   // ✅ CHANGED
      !experienceYears ||
      specializations.length === 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email: email.trim().toLowerCase(),
          password,
          role: "ADVOCATE",
          officeId, // ✅ CHANGED
          experienceYears: Number(experienceYears),
          specialization: specializations.join(", "),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("OTP sent to your email");
      localStorage.setItem("pendingOtpEmail", email);
      navigate("/verify-otp");

    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="info-page">
      <div className="info-container">
        <div className="register-header">
          <div className="register-logo">⚖️</div>
          <h2>Advocate Registration</h2>
          <p>Join CourtLink as an Advocate</p>
        </div>

        <div className="register-form">

          <label>I am *</label>
          <select
            value={role}
            onChange={(e) => {
              const selectedRole = e.target.value;
              setRole(selectedRole);

              if (selectedRole === "CLIENT") {
                navigate("/register");
              }
            }}
          >
            <option value="CLIENT">Client</option>
            <option value="ADVOCATE">Advocate</option>
          </select>

          <label>Full Name *</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} />

          <label>Email *</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Password *</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <label>Confirm Password *</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          {/* 🔥 CHANGED FIELD */}
          <label>Office ID *</label>
          <input
            value={officeId}
            placeholder="Office ID"
            onChange={(e) => setOfficeId(e.target.value)}
          />

          <label>Years of Experience *</label>
          <input
            type="number"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
          />

          <p className="section-label">Case Specialization *</p>

          <div className="checkbox-grid">
            {specializationList.map((item) => (
              <label className="checkbox-item" key={item}>
                <input
                  type="checkbox"
                  checked={specializations.includes(item)}
                  onChange={() => handleCheckboxChange(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <button className="register-btn" onClick={handleRegister}>
            Register
          </button>

        </div>
      </div>
    </div>
  );
}

export default AdvocateRegister;