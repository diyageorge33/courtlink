import React, { useEffect, useState } from "react";
import { fetchBookings } from "../../api/advocateApi";
import "../../newstyles.css";

const AdvocateAppointments = () => {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchBookings();
        setBookings(data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="client-dashboard-new">
      <h1 className="section-title-new">Appointments</h1>

      {!selected ? (
        <div className="experts-grid">

          {bookings.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No appointments yet.</p>
          ) : (
            bookings.map((b, i) => (
              <div
                key={i}
                className="expert-card"
                style={{ cursor: "pointer" }}
                onClick={() => setSelected(b)}
              >
                <h3>{b.name}</h3>
                <p>📅 {new Date(b.preferred_date).toDateString()}</p>
                <p style={{ color: "#22c55e" }}>₹{b.amount}</p>
              </div>
            ))
          )}

        </div>
      ) : (
        <div className="expert-card" style={{ maxWidth: "500px", margin: "auto" }}>
          
          <h2>{selected.name}</h2>

          <p><strong>Email:</strong> {selected.email}</p>
          <p><strong>Phone:</strong> {selected.phone}</p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(selected.preferred_date).toDateString()}
          </p>

          <p><strong>Amount Paid:</strong> ₹{selected.amount}</p>

          <p style={{ fontSize: "12px", color: "#94a3b8" }}>
            Payment ID: {selected.payment_id}
          </p>

          <button
            className="expert-btn"
            style={{ marginTop: "15px" }}
            onClick={() => setSelected(null)}
          >
            ← Back
          </button>

        </div>
      )}
    </div>
  );
};

export default AdvocateAppointments;