import { useEffect, useState } from "react";

function ClientNotifications() {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/client/notifications",
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

  }, []);

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
                <tr key={index}>
                  <td>{n.message}</td>
                  <td>
                    {new Date(n.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      )}

    </div>

  );
}

export default ClientNotifications;