import React, { useEffect, useState } from "react";
import { fetchProfile, updateAdvocateProfile } from "../../api/advocateApi";
import "../../newstyles.css";

const AdvocateSettings = () => {
  const [form, setForm] = useState({
    specialization: "",
    experience_years: "",
    fee_per_hour: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");

        // 🔥 If not logged in → prevent crash
        if (!token) {
          console.log("No token found");
          setLoading(false);
          return;
        }

        const data = await fetchProfile();

        console.log("PROFILE DATA:", data); // debug

        setForm({
          specialization: data?.specialization || "",
          experience_years: data?.experience_years || "",
          fee_per_hour: data?.fee_per_hour || "",
        });

      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await updateAdvocateProfile(form);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // Loading screen (prevents blank page)
  if (loading) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        Loading...
      </div>
    );
  }
    const inputStyle = {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #334155",
        background: "#0f172a",
        color: "white",
        outline: "none",
    };
 return (
  <div className="client-dashboard-new">
    <h1 className="section-title-new">⚙️ Advocate Settings</h1>

    <div
      style={{
        maxWidth: "420px",
        margin: "40px auto",
        padding: "25px",
        borderRadius: "16px",
        background: "#1e293b",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
    >

      <label style={{ color: "#94a3b8" }}>Specialization</label>
      <input
        type="text"
        name="specialization"
        value={form.specialization}
        onChange={handleChange}
        placeholder="e.g. Civil Law"
        style={inputStyle}
      />

      <label style={{ color: "#94a3b8" }}>Experience (years)</label>
      <input
        type="number"
        name="experience_years"
        value={form.experience_years}
        onChange={handleChange}
        placeholder="e.g. 3"
        style={inputStyle}
      />

      <label style={{ color: "#94a3b8" }}>Fee per hour (₹)</label>
      <input
        type="number"
        name="fee_per_hour"
        value={form.fee_per_hour}
        onChange={handleChange}
        placeholder="e.g. 500"
        style={inputStyle}
      />

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "10px",
          padding: "12px",
          borderRadius: "10px",
          border: "none",
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseOver={(e) => (e.target.style.opacity = "0.9")}
        onMouseOut={(e) => (e.target.style.opacity = "1")}
      >
        Save Changes
      </button>

    </div>
  </div>
);
};

export default AdvocateSettings;