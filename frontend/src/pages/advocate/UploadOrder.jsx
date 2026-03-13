import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../newstyles.css";

function UploadOrder() {
  const navigate = useNavigate();
  const [caseId, setCaseId] = useState("");
  const [file, setFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cases, setCases] = useState([]);
  const advocateId = localStorage.getItem("user_id");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [ordersRes, casesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:5000/api/advocate/cases/${advocateId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setOrders(ordersRes.data);
      setCases(casesRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [advocateId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!caseId) {
      alert("Please select a case");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("order", file);
      formData.append("case_id", caseId);

      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/orders/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Order uploaded successfully");
      setFile(null);
      setCaseId("");
      fetchData(); // Refresh list
    } catch (err) {
      console.error(err);
      alert("Error uploading order");
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/orders/delete/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData(); // Refresh list
    } catch (err) {
      console.error(err);
      alert("Error deleting order");
    }
  };

  return (
    <div className="client-dashboard-new">
      <div className="documents-header-new">
        <h1 className="page-title-new">Order Management</h1>
        <div className="documents-header-buttons">
          <button
            className="dashboard-btn-new"
            onClick={() => navigate("/dashboard/advocate")}
          >
            ← Dashboard
          </button>
        </div>
      </div>

      <div className="upload-box-new" style={{ marginBottom: "40px" }}>
        <h2 className="section-title-new">Upload New Court Order</h2>
        <div className="form-card-new">
          <form onSubmit={handleUpload}>
            <label>Select Case</label>
            <select
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              required
              className="custom-select-new"
            >
              <option value="">-- Choose Assigned Case --</option>
              {cases.map((c) => (
                <option key={c.case_id} value={c.case_id}>
                  {c.case_title} (ID: {c.case_id})
                </option>
              ))}
            </select>

            <label style={{ display: "block", marginTop: "15px" }}>
              Upload Order File (PDF/Doc)
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />

            <button type="submit" className="primary-btn-new">
              Upload Order
            </button>
          </form>
        </div>
      </div>

      <div className="table-container-new">
        <h2 className="section-title-new">Recently Uploaded Orders</h2>
        {orders.length === 0 ? (
          <p className="table-hint-new">No orders uploaded yet.</p>
        ) : (
          <table className="custom-table-new">
            <thead>
              <tr>
                <th>#</th>
                <th>Case Title</th>
                <th>File Name</th>
                <th>Uploaded At</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, index) => (
                <tr key={o.order_id}>
                  <td>{index + 1}</td>
                  <td className="bold-text">{o.case_title}</td>
                  <td>{o.file_name}</td>
                  <td>{new Date(o.uploaded_at).toLocaleString()}</td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="icon-btn-delete"
                      onClick={() => handleDelete(o.order_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UploadOrder;