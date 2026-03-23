import React, { useEffect, useState } from "react";
import { fetchAllAdvocates } from "../api/advocateApi";
import "../newstyles.css";
import toast from "react-hot-toast";
import axios from "axios";

const Bookappointment = () => {
  const [advocates, setAdvocates] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: ""
  });

  const [showAdvocates, setShowAdvocates] = useState(false);

  // 🔥 DATE LIMITS
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const maxDateObj = new Date();
  maxDateObj.setDate(today.getDate() + 30); // only next 30 days
  const maxDate = maxDateObj.toISOString().split("T")[0];

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAllAdvocates();
        setAdvocates(data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  // 🔥 PAYMENT
  const handlePayment = (adv) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: (adv.fee_per_hour || 500) * 100,
      currency: "INR",
      name: "CourtLink",
      description: `Consultation with ${adv.full_name}`,

      handler: async function (response) {
        try {
          await axios.post("http://localhost:5000/api/booking", {
            name: form.name,
            email: form.email,
            phone: form.phone,
            preferred_date: form.date,
            advocate_id: adv.advocate_id,
            advocate_name: adv.full_name,
            amount: adv.fee_per_hour,
            payment_id: response.razorpay_payment_id
          });

          toast.success("Appointment booked successfully 🎉");
        } catch (err) {
          console.error(err);
          toast.error("Booking failed");
        }
      },

      prefill: {
        name: form.name,
        email: form.email
      },

      theme: {
        color: "#6366f1",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ============================
  // 🔥 FORM UI (IMPROVED)
  // ============================
  if (!showAdvocates) {
    return (
      <div className="client-dashboard-new">
        <h1 className="section-title-new">Book Appointment</h1>

        <div style={cardStyle}>
          <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
            Enter Details
          </h2>

          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            style={inputStyle}
          />

          <input
            type="date"
            min={minDate}   // ❌ no past
            max={maxDate}   // ❌ no far future
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            style={inputStyle}
          />

          <button
            onClick={() => {
              if (!form.name || !form.email || !form.phone || !form.date) {
                toast.error("Please fill all fields");
                return;
              }
              setShowAdvocates(true);
            }}
            style={buttonStyle}
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  // ============================
  // 🔥 ADVOCATE LIST
  // ============================
  return (
    <div className="client-dashboard-new">
      <h1 className="section-title-new">Select Advocate</h1>

      <div className="experts-grid">
        {advocates.map((adv, index) => (
          <div key={index} className="expert-card">

            <img
              src={
                adv.profile_image
                  ? `http://localhost:5000/uploads/${adv.profile_image}`
                  : `https://ui-avatars.com/api/?name=${adv.full_name}`
              }
              alt="profile"
              className="expert-img"
            />

            <h3>{adv.full_name}</h3>

            <p><strong>{adv.specialization}</strong></p>
            <p>{adv.experience_years} years experience</p>

            <p style={{ color: "#22c55e", fontWeight: "bold" }}>
              ₹{adv.fee_per_hour || 500}/hour
            </p>

            <button
              className="expert-btn"
              onClick={() => handlePayment(adv)}
            >
              Book & Pay
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

// ============================
// 🎨 STYLES (CLEAN UI)
// ============================

const cardStyle = {
  maxWidth: "420px",
  margin: "40px auto",
  padding: "25px",
  borderRadius: "16px",
  background: "#1e293b",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
};

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
  outline: "none"
};

const buttonStyle = {
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
};

export default Bookappointment;