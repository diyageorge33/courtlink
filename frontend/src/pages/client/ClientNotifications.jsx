import { useEffect, useState } from "react";

function ClientNotifications() {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); //  NEW

  useEffect(() => {

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/client/notifications?page=${page}`, //  UPDATED
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          setNotifications([]);
        }

      } catch (err) {
        console.error(err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

  }, [page]); //  UPDATED

  return (

    <div className="client-dashboard-new">

      <h1>Notifications</h1>

      <p
        style={{
          marginTop: "8px",
          color: "#94a3b8",
          fontSize: "14px"
        }}
      >
        Stay updated with your case activity and reminders.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications yet</p>
      ) : (

        <>
          <div className="cases-table-wrapper-new">

            <table className="cases-table-new">

              <thead>
                <tr>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {notifications.map((n, index) => (
                  <tr key={n.notification_id || n.created_at + index}>
                    <td>{n.message}</td>
                    <td>
                      {new Date(n.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

          {/*  PAGINATION BUTTONS */}
          <div style={{ marginTop: "20px", display: "flex", gap: "10px", alignItems: "center" }}>

            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>

            <span>Page {page}</span>

            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={notifications.length < 10} // assuming backend limit = 10
            >
              Next
            </button>

          </div>
        </>
      )}

    </div>

  );
}

export default ClientNotifications;