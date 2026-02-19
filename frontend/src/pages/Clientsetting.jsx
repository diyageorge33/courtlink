import { useEffect, useState } from "react";
import Sidebar from "../components/ClientSidebar";
import { fetchClientSettings, updateClientSettings } from "../api/clientApi";

function Clientsetting() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
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
        const clientId = localStorage.getItem("userId");

        if (!clientId) {
          alert("Client not logged in");
          return;
        }

        const data = await fetchClientSettings(clientId);

        setFormData({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          dob: data.dob ? data.dob.split("T")[0] : "",
          gender: data.gender || "",
          role: data.role || "CLIENT",
        });
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
      const clientId = localStorage.getItem("userId");

      if (!clientId) {
        alert("Client not logged in");
        return;
      }

      setSaving(true);

      await updateClientSettings(clientId, {
        full_name: formData.full_name,
        phone: formData.phone,
        address: formData.address,
        dob: formData.dob === "" ? null : formData.dob,
        gender: formData.gender === "" ? null : formData.gender,
      });

      alert("Settings updated successfully!");
    } catch (err) {
      console.error("Update settings error:", err);
      alert("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="client-layout">
      <Sidebar />

      <main className="client-content">
        <h1>Settings</h1>
        <p className="dashboard-subtitle">
          Manage your profile details and personal information.
        </p>

        {loading ? (
          <p>Loading settings...</p>
        ) : (
          <div className="settings-grid">
            {/* LEFT SIDE: PROFILE CARD */}
            <div className="profile-summary-card">
              <h2>My Profile</h2>
              <p className="profile-summary-subtitle">
                Your saved details in CourtLink.
              </p>

              <div className="profile-summary-details">
                <p>
                  <b>Name:</b> {formData.full_name || "Not Provided"}
                </p>

                <p>
                  <b>Email:</b> {formData.email || "Not Provided"}
                </p>

                <p>
                  <b>Phone:</b> {formData.phone || "Not Provided"}
                </p>

                <p>
                  <b>DOB:</b> {formData.dob || "Not Provided"}
                </p>

                <p>
                  <b>Gender:</b> {formData.gender || "Not Provided"}
                </p>

                <p>
                  <b>Address:</b> {formData.address || "Not Provided"}
                </p>

                <hr />

                <p>
                  <b>Account Type:</b> {formData.role}
                </p>
              </div>

              <p className="profile-summary-tip">
                💡 Tip: Keeping your profile updated helps advocates understand
                your case better.
              </p>
            </div>

            {/* RIGHT SIDE: EDIT FORM */}
            <div className="settings-card">
              <h2>Edit Profile</h2>
              <p className="settings-subtitle">
                Update your personal details below.
              </p>

              <label>Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
              />

              <label>Email (cannot change)</label>
              <input type="text" value={formData.email} disabled />

              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />

              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />

              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
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
              />

              <button className="action-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Update Profile"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Clientsetting;
