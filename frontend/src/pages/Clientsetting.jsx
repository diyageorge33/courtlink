import { useEffect, useState } from "react";
import Sidebar from "../components/ClientSidebar";
import { fetchClientSettings, updateClientSettings } from "../api/clientApi";

function Clientsetting() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    dob: "",
    gender: "",
    email: "",
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
        address: data.address || "",
        dob: data.dob ? data.dob.split("T")[0] : "",
        gender: data.gender || "",
        });

      } catch (err) {
        console.error("Settings fetch error:", err);
        // alert("Failed to load settings");
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
        address: formData.address,
        dob: formData.dob,
        gender: formData.gender,
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
          Manage your personal information here.
        </p>

        {loading ? (
          <p>Loading settings...</p>
        ) : (
          <div className="settings-card">
            <h3>Client Profile</h3>

            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
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
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Clientsetting;
