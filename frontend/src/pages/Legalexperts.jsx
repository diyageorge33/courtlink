import React, { useEffect, useState } from "react";
import { fetchAllAdvocates } from "../api/advocateApi";
import "../newstyles.css";

const LegalExperts = () => {
  const [advocates, setAdvocates] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadAdvocates = async () => {
      try {
        const data = await fetchAllAdvocates();

        // ✅ Sort by experience (highest first)
        const sorted = data.sort((a, b) => b.experience - a.experience);

        setAdvocates(sorted);
      } catch (err) {
        console.error(err);
      }
    };

    loadAdvocates();
  }, []);

  // ✅ Filter advocates (name + specialization)
  const filteredAdvocates = advocates.filter((adv) => {
    const query = search.toLowerCase();

    return (
      adv.full_name.toLowerCase().includes(query) ||
      adv.specialization?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="client-dashboard-new">
      <h1 className="section-title-new">Legal Experts</h1>

      {/* 🔍 Search Bar */}
      <div style={{ marginBottom: "25px" }}>
        <input
          type="text"
          placeholder="🔍 Search advocates by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "white",
            outline: "none"
          }}
        />
      </div>

      {/* 🧑‍⚖️ Cards */}
      <div className="experts-grid">
        {filteredAdvocates.length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: "16px" }}>
            No legal experts found.
          </p>
        ) : (
          filteredAdvocates.map((adv, index) => (
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

              {/* ✅ Clean Specialization */}
              <p>
                <strong>Specialization:</strong>{" "}
                {adv.specialization
                  ? adv.specialization
                      .split(" ")
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")
                  : "Not specified"}
              </p>

              {/* ✅ Clean Experience */}
              <p>
                <strong>Experience:</strong>{" "}
                {adv.experience ? `${adv.experience} years` : "Not specified"}
              </p>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LegalExperts;