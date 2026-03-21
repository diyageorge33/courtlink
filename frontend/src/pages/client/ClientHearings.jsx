import { useEffect, useState } from "react";

function ClientHearings() {

  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHearings = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/client/cases/upcoming",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setHearings(data);
        } else {
          setHearings([]);
        }

      } catch (err) {
        console.error(err);
        setHearings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHearings();
  }, []);

  // 🔥 Helper to calculate days left
  const getDaysLeft = (date) => {
    const today = new Date();
    const hearingDate = new Date(date);

    const diffTime = hearingDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (

    <div className="client-dashboard-new">

      <h1>Upcoming Hearings</h1>

      <p
        style={{
          marginTop: "8px",
          color: "#94a3b8",
          fontSize: "14px"
        }}
      >
        Stay updated with your upcoming court schedules.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : hearings.length === 0 ? (
        <p>No upcoming hearings</p>
      ) : (

        <div className="cases-table-wrapper-new">

          <table className="cases-table-new">

            <thead>
              <tr>
                <th>Case ID</th>
                <th>Case Title</th>
                <th>Next Hearing</th>
              </tr>
            </thead>

            <tbody>
              {hearings.map((h) => {

                const daysLeft = getDaysLeft(h.next_hearing_date);
                const hearingDate = new Date(h.next_hearing_date);

                return (
                  <tr key={h.case_id}>
                    <td>{h.case_id}</td>
                    <td>{h.case_title}</td>
                    <td>

                      {hearingDate.toLocaleDateString()}

                      <br />

                      <span
                        style={{
                          fontSize: "12px",
                          color: daysLeft <= 3 ? "#ef4444" : "#3b82f6"
                        }}
                      >
                        {daysLeft === 0
                          ? "Today"
                          : daysLeft === 1
                          ? "Tomorrow"
                          : `${daysLeft} days left`}
                      </span>

                    </td>
                  </tr>
                );

              })}
            </tbody>

          </table>

        </div>

      )}

    </div>

  );
}

export default ClientHearings;