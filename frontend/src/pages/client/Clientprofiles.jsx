import { useState } from "react";
import Sidebar from "../../components/ClientSidebar";

function ClientProfile() {
  const [profile, setProfile] = useState({
    clientId: "CL1001",
    fullName: "Diya George",
    email: "diya@gmail.com",
    dob: "2004-06-15",
    gender: "FEMALE",
    address: "Kochi, Kerala, India",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Profile Updated Successfully ✅");
    console.log("Updated Profile:", profile);
  };

  return (
    <div className="dashboard-body">
      <Sidebar />

      <main className="dashboard-content">
        <h1>My Profile</h1>
        <p className="dashboard-subtitle">
          View and edit your personal details.
        </p>

        <div className="profile-card">
          <label>Client ID</label>
          <input type="text" value={profile.clientId} disabled />

          <label>Full Name</label>
          <input type="text" value={profile.fullName} disabled />

          <label>Email</label>
          <input type="text" value={profile.email} disabled />

          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={profile.dob}
            onChange={handleChange}
          />

          <label>Gender</label>
          <select name="gender" value={profile.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>

          <label>Address</label>
          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            rows="4"
          />

          <button className="action-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
}

export default ClientProfile;
