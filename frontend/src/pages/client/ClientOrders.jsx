import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ClientOrders() {

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1); //  NEW
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/client-orders?page=${page}`, //  UPDATED
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
  }, [page]); //  UPDATED

  return (
    <div className="client-dashboard-new">

      <h1>View Orders</h1>

      {orders.length === 0 ? (
        <p>No orders available yet.</p>
      ) : (
        <>
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
                  <td>{(page - 1) * 5 + index + 1}</td> {/*  FIXED NUMBERING */}
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

          {/* PAGINATION BUTTONS */}
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
              disabled={orders.length < 5} 
            >
              Next
            </button>

          </div>
        </>
      )}

    </div>
  );
}

export default ClientOrders;