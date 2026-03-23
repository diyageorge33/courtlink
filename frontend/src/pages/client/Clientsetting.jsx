import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchClientSettings,
  updateClientSettings,
  requestAccountClosure,
  cancelAccountClosure
} from "../../api/clientApi";
import "../../newstyles.css";
import toast from "react-hot-toast";

function Clientsetting() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [closurePending, setClosurePending] = useState(false);
  const [showModal, setShowModal] = useState(false); // 🔥 modal state

  const [formData, setFormData] = useState({
  user_id: "", 
  full_name: "",
  email: "",
  phone: "",
  address: "",
  dob: "",
  gender: "",
  role: "",
});

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchClientSettings();

        setFormData({
          user_id: data.user_id || "", // ✅ added
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          dob: data.dob ? data.dob.split("T")[0] : "",
          gender: data.gender || "",
          role: data.role || "CLIENT",
        });

        if (data.account_status === "PENDING_CLOSURE") {
          setClosurePending(true);
        }

      } catch (err) {
        console.error("Settings fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateClientSettings({
        full_name: formData.full_name,
        phone: formData.phone,
        address: formData.address,
        dob: formData.dob || null,
        gender: formData.gender || null,
      });

      toast.success("Settings updated successfully!");

    } catch (err) {
      console.error("Update settings error:", err);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  // 🔥 CONFIRM CLOSE (from modal)
  const confirmCloseAccount = async () => {
    try {
      await requestAccountClosure();
      setClosurePending(true);
      setShowModal(false);
      toast.success("Account closure requested");
    } catch (err) {
      toast.error("Failed to request closure");
    }
  };

  const handleCancelClosure = async () => {
    try {
      await cancelAccountClosure();
      setClosurePending(false);
      toast.success("Account restored successfully");
    } catch (err) {
      toast.error("Failed to cancel closure");
    }
  };

  return (
    <div className="client-dashboard-new">

      {/* HEADER */}
      <div className="page-header-new">
        <h1 className="page-title-new">Settings</h1>

        <button
          type="button"
          className="dashboard-btn-new"
          onClick={() => navigate("/dashboard/client")}
        >
          ← Dashboard
        </button>
      </div>

      <p className="ai-tagline-new">
        Manage your profile details
      </p>

      {loading ? (
        <p>Loading settings...</p>
      ) : (

        <div className="settings-grid-new">

          {/* PROFILE CARD */}
          <div className="profile-summary-card-new">

            <h2>My Profile</h2>
            <p><b>Client ID/User ID:</b> {formData.user_id || "Not Available"}</p>
            <p><b>Name:</b> {formData.full_name || "Not Provided"}</p>
            <p><b>Email:</b> {formData.email || "Not Provided"}</p>
            <p><b>Phone:</b> {formData.phone || "Not Provided"}</p>
            <p><b>DOB:</b> {formData.dob || "Not Provided"}</p>
            <p><b>Gender:</b> {formData.gender || "Not Provided"}</p>
            <p><b>Address:</b> {formData.address || "Not Provided"}</p>

            <hr />

            <p><b>Account Type:</b> {formData.role}</p>

            <div style={{ marginTop: "15px" }}>
              {closurePending ? (
                <>
                  <p style={{ color: "#f59e0b", fontWeight: "bold" }}>
                    ⚠️ Account Closure Pending
                  </p>

                  <button
                    type="button"
                    className="dashboard-btn-new"
                    onClick={handleCancelClosure}
                  >
                    Cancel Closure
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="dashboard-btn-new"
                  style={{ background: "#ef4444", color: "#fff" }}
                  onClick={() => setShowModal(true)} // 🔥 open modal
                >
                  Close Account
                </button>
              )}
            </div>

          </div>

          {/* EDIT PROFILE */}
          <div className="settings-card-new">

            <h2>Edit Profile</h2>

            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              disabled={closurePending}
            />

            <label>Email</label>
            <input type="text" value={formData.email} disabled />

            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={closurePending}
            />

            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              disabled={closurePending}
            />

            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={closurePending}
            >
              <option value="">-- Select --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label>Address</label>
            <textarea
              rows="4"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={closurePending}
            />

            <button
              type="button"
              className="primary-btn-new"
              onClick={handleSave}
              disabled={saving || closurePending}
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>

          </div>

        </div>
      )}

      {/* 🔥 CUSTOM MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Action</h3>
            <p>Are you sure you want to close your account?</p>

            <div className="modal-buttons">
              <button
                type="button"
                className="dashboard-btn-new"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="dashboard-btn-new"
                style={{ background: "#ef4444", color: "#fff" }}
                onClick={confirmCloseAccount}
              >
                Yes, Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Clientsetting;