import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../newstyles.css"; 

function AdminPendingAdvocates() {
  const [advocates, setAdvocates] = useState([]);

  const fetchPending = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/admin/pending-advocates");
      const data = await res.json();
      setAdvocates(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load advocates");
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/admin/approve-advocate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("Approved!");
      fetchPending();

    } catch (err) {
      console.error(err);
      toast.error("Error approving");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/admin/reject-advocate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("Rejected!");

      setAdvocates((prev) => prev.filter((adv) => adv.id !== id));
      fetchPending();

    } catch (err) {
      console.error(err);
      toast.error("Error rejecting");
    }
  };

  const confirmApprove = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Approve this advocate?</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              onClick={() => {
                handleApprove(id);
                closeToast();
              }}
              style={{
                padding: "6px 12px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Yes
            </button>

            <button
              onClick={closeToast}
              style={{
                padding: "6px 12px",
                background: "#64748b",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  const confirmReject = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Reject this advocate?</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              onClick={() => {
                handleReject(id);
                closeToast();
              }}
              style={{
                padding: "6px 12px",
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Yes
            </button>

            <button
              onClick={closeToast}
              style={{
                padding: "6px 12px",
                background: "#64748b",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  return (
    <div className="pending-container">
      <h2 className="pending-title">Pending Advocates</h2>

      {advocates.length === 0 ? (
        <p className="pending-empty-text">No pending advocates</p>
      ) : (
        <div className="pending-card-grid">
          {advocates.map((adv) => (
            <div className="pending-adv-card" key={adv.id}>
              <h3>{adv.full_name}</h3>
              <p><strong>Email:</strong> {adv.email}</p>
              <p><strong>Office ID:</strong> {adv.office_id}</p>
              <p><strong>Specialization:</strong> {adv.specialization}</p>
              <p><strong>Experience:</strong> {adv.experience_years} yrs</p>

              <div className="pending-card-actions">
                <button
                  className="pending-approve-btn"
                  onClick={() => confirmApprove(adv.id)}
                >
                  Approve
                </button>

                <button
                  className="pending-reject-btn"
                  onClick={() => confirmReject(adv.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPendingAdvocates;