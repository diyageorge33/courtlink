import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AdminPendingAdvocates() {
  const [advocates, setAdvocates] = useState([]);

  // 🔹 fetch pending advocates
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

  // 🔹 approve
  const handleApprove = async (id) => {
    if (!window.confirm("Approve this advocate?")) return;

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
      fetchPending(); // refresh list

    } catch (err) {
      console.error(err);
      toast.error("Error approving");
    }
  };

  // 🔹 reject
  const handleReject = async (id) => {
    if (!window.confirm("Reject this advocate?")) return;

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

      // 🔥 remove from UI instantly (better UX)
      setAdvocates((prev) => prev.filter((adv) => adv.id !== id));

      // 🔥 also refetch to stay in sync
      fetchPending();

    } catch (err) {
      console.error(err);
      toast.error("Error rejecting");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pending Advocates</h2>

      {advocates.length === 0 ? (
        <p>No pending advocates</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Office ID</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {advocates.map((adv) => (
              <tr key={adv.id}>
                <td>{adv.full_name}</td>
                <td>{adv.email}</td>
                <td>{adv.office_id}</td>
                <td>{adv.specialization}</td>
                <td>{adv.experience_years} yrs</td>

                <td>
                  <button onClick={() => handleApprove(adv.id)}>
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(adv.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPendingAdvocates;