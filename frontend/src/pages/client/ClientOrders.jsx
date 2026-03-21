import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ClientOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/client-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="client-dashboard-new">
      <h1>View Orders</h1>

      {orders.length === 0 ? (
        <p>No orders available yet.</p>
      ) : (
        <table className="custom-table-new">
          <thead>
            <tr>
              <th>#</th>
              <th>Case Title</th>
              <th>File Name</th>
              <th>Uploaded At</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o, index) => (
              <tr key={o.order_id}>
                <td>{index + 1}</td>
                <td>{o.case_title}</td>
                <td>{o.file_name}</td>
                <td>
                  {new Date(o.uploaded_at).toLocaleString()}
                </td>
                <td>
                  <a
                    href={`http://localhost:5000/uploads/orders/${o.file_name}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#38bdf8", fontWeight: "600" }}
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ClientOrders;