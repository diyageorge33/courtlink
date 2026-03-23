import React, { useEffect, useState } from "react";
import { fetchAllAdvocates } from "../api/advocateApi";
import "../newstyles.css";
import toast from "react-hot-toast";
import axios from "axios";

//  send cookies
axios.defaults.withCredentials = true;

const Bookappointment = () => {
  const [advocates, setAdvocates] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: ""
  });

  const [showAdvocates, setShowAdvocates] = useState(false);
  const [bookingsMap, setBookingsMap] = useState({});

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const maxDateObj = new Date();
  maxDateObj.setDate(today.getDate() + 30);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  // 
  // LOAD ADVOCATES
  //
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

  
  //  CHECK BOOKINGS (COOKIE BASED)
 
  useEffect(() => {
    const checkBookings = async () => {
      if (advocates.length === 0) return;

      const map = {};

      for (let adv of advocates) {
        try {
          const res = await fetch(
            `http://localhost:5000/api/bookings/check?advocate_id=${adv.advocate_id}`,
            {
              credentials: "include"
            }
          );

          const data = await res.json();

          if (data) {
            map[adv.advocate_id] = data.preferred_date;
          }
        } catch (err) {
          console.error(err);
        }
      }

      setBookingsMap(map);
    };

    checkBookings();
  }, [advocates]);

  
  //  PAYMENT
  
  const handlePayment = (adv) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: (adv.fee_per_hour || 500) * 100,
      currency: "INR",
      name: "CourtLink",
      description: `Consultation with ${adv.full_name}`,

      handler: async function (response) {
        try {
          await axios.post("http://localhost:5000/api/bookings", {
            name: form.name,
            email: form.email,
            phone: form.phone,
            preferred_date: form.date,
            advocate_id: adv.advocate_id,
            amount: adv.fee_per_hour,
            payment_id: response.razorpay_payment_id
          });

          toast.success("Appointment booked successfully 🎉");

          setBookingsMap(prev => ({
            ...prev,
            [adv.advocate_id]: form.date
          }));

        } catch (err) {
          console.error(err);
          toast.error(err.response?.data?.message || "Booking failed");
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


  // FORM PAGE
 
  if (!showAdvocates) {
    return (
      <div className="booking-container">
        <h1 className="booking-title">Book Appointment</h1>

        <div className="booking-card">
          <h2>Enter Details</h2>

          <input
            className="booking-input"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="booking-input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="booking-input"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            className="booking-input"
            type="date"
            min={minDate}
            max={maxDate}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <button
            className="booking-btn"
            onClick={() => {
              if (!form.name || !form.email || !form.phone || !form.date) {
                toast.error("Please fill all fields");
                return;
              }
              setShowAdvocates(true);
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  
  // ADVOCATE LIST
  
  return (
    <div className="booking-container">
      <h1 className="booking-title">Select Advocate</h1>

      <div className="booking-grid">
        {advocates.map((adv, index) => (
          <div key={index} className="booking-card-item">

            <img
              src={
                adv.profile_image
                  ? `http://localhost:5000/uploads/${adv.profile_image}`
                  : `https://ui-avatars.com/api/?name=${adv.full_name}`
              }
              alt="profile"
              className="booking-img"
            />

            <h3>{adv.full_name}</h3>

            <p><strong>{adv.specialization}</strong></p>
            <p>{adv.experience_years} years experience</p>

            <p className="booking-price">
              ₹{adv.fee_per_hour || 500}/hour
            </p>

            {bookingsMap[adv.advocate_id] ? (
              <p className="booking-booked">
                  Appointment on{" "}
                  {new Date(bookingsMap[adv.advocate_id]).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                  })}
              </p>
            ) : (
              <button
                className="booking-btn"
                onClick={() => handlePayment(adv)}
              >
                Book & Pay
              </button>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookappointment;