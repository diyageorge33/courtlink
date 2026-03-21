import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "../../newstyles.css";

function UploadOrder() {
  const navigate = useNavigate();

  const [caseId, setCaseId] = useState("");
  const [file, setFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cases, setCases] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const token = localStorage.getItem("token");

  let advocateId = null;
  if (token) {
    const decoded = jwtDecode(token);
    advocateId = decoded.user_id;
  }

  const fetchData = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      // const [ordersRes, casesRes] = await Promise.all([
      //   axios.get("http://localhost:5000/api/orders/my-orders", {
      //     headers: { Authorization: `Bearer ${token}` },
      //   }),
      //   axios.get(
      //     `http://localhost:5000/api/advocate/cases/${advocateId}`,
      //     {
      //       headers: { Authorization: `Bearer ${token}` },
      //     }
      //   ),
      // ]);

      let ordersRes, casesRes;

try {
  ordersRes = await axios.get("http://localhost:5000/api/orders/my-orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
} catch (err) {
  console.error("Orders API failed:", err);
  ordersRes = { data: [] }; // fallback
}

try {
  casesRes = await axios.get(
    `http://localhost:5000/api/advocate/cases/${advocateId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
} catch (err) {
  console.error("Cases API failed:", err);
  casesRes = { data: [] };
}

setOrders(ordersRes.data);
setCases(casesRes.data);
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
      toast.warn("Please select a case");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("order", file);
      formData.append("case_id", caseId);

      await axios.post(
        "http://localhost:5000/api/orders/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order uploaded successfully");

      setFile(null);
      setCaseId("");

      fetchData();

    } catch (err) {
      console.error(err);
      toast.error("Error uploading order");
    }
  };

  const promptDelete = (orderId) => {
    setDeleteConfirmId(orderId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/orders/delete/${deleteConfirmId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Order deleted successfully");
      setShowDeleteModal(false);
      fetchData();

    } catch (err) {
      console.error(err);
      toast.error("Error deleting order");
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
                      onClick={() => promptDelete(o.order_id)}
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

      {showDeleteModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-card" style={{ maxWidth: "450px" }}>
            <h3 style={{ marginBottom: "15px", color: "white" }}>Delete Order?</h3>
            <p style={{ fontSize: "14px", color: "#cbd5e1", margin: "0 0 25px 0" }}>
              Are you sure you want to delete this court order document?
            </p>
            <div className="custom-modal-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default UploadOrder;