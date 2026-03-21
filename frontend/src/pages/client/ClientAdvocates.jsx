import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ClientAdvocates() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdvocate, setSelectedAdvocate] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [confirmRequest, setConfirmRequest] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/client/advocates",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (Array.isArray(result)) {
        setData(result);
      } else {
        setData([]);
      }

    } catch (err) {
      console.error(err);
      setData([]);
      toast.error("Failed to load advocates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestChange = async () => {
    try {
      setRequesting(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/client/request-advocate-change/${selectedAdvocate.case_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = await res.json();

      toast.success(response.message);

      setData((prev) =>
        prev.map((item) =>
          item.case_id === selectedAdvocate.case_id
            ? { ...item, advocate_change_requested: true }
            : item
        )
      );

      setSelectedAdvocate((prev) => ({
        ...prev,
        advocate_change_requested: true
      }));

    } catch (err) {
      console.error(err);
      toast.error("Request failed");
    } finally {
      setRequesting(false);
    }
  };

  const handleCancelRequest = async () => {
    try {
      setRequesting(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/client/cancel-advocate-change/${selectedAdvocate.case_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      toast.success(data.message);

      setData((prev) =>
        prev.map((item) =>
          item.case_id === selectedAdvocate.case_id
            ? { ...item, advocate_change_requested: false }
            : item
        )
      );

      setSelectedAdvocate((prev) => ({
        ...prev,
        advocate_change_requested: false
      }));

    } catch (err) {
      console.error(err);
      toast.error("Cancel failed");
    } finally {
      setRequesting(false);
    }
  };

  return (

    <div className="client-dashboard-new">

      <h1>My Advocates</h1>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No advocates assigned</p>
      ) : (

        <>
          <div className="cases-table-wrapper-new">

            <table className="cases-table-new">

              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Case Title</th>
                  <th>Advocate</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => (
                  <tr key={item.case_id}>
                    <td>{item.case_id}</td>
                    <td>{item.case_title}</td>

                    <td
                      style={{
                        color: "#3b82f6",
                        cursor: "pointer",
                        textDecoration: "underline"
                      }}
                      onClick={() => setSelectedAdvocate(item)}
                    >
                      {item.advocate_name}
                    </td>

                    <td>
                      {item.advocate_change_requested ? (
                        <span style={{
                          background: "#f59e0b",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          color: "black",
                          fontSize: "12px"
                        }}>
                          Change Requested
                        </span>
                      ) : (
                        <span style={{
                          background: "#22c55e",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          color: "black",
                          fontSize: "12px"
                        }}>
                          Assigned
                        </span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>

          {/* DETAILS */}
          {selectedAdvocate && (
            <div className="upload-box-new" style={{ marginTop: "20px" }}>

              <h3>Advocate Details</h3>

              <p><strong>Name:</strong> {selectedAdvocate.advocate_name}</p>
              <p><strong>Phone:</strong> {selectedAdvocate.phone || "N/A"}</p>
              <p><strong>Specialization:</strong> {selectedAdvocate.specialization}</p>
              <p><strong>Experience:</strong> {selectedAdvocate.experience_years} years</p>

              {/* 🔥 FIXED BUTTON */}
              <button
                className={
                  selectedAdvocate.advocate_change_requested
                    ? "mycase-danger-btn"
                    : "primary-btn-new"
                }
                onClick={() => {
                  if (selectedAdvocate.advocate_change_requested) {
                    handleCancelRequest();
                  } else {
                    setConfirmRequest(true);
                  }
                }}
                disabled={requesting && !selectedAdvocate.advocate_change_requested}
              >
                {selectedAdvocate.advocate_change_requested
                  ? "Cancel Request"
                  : requesting
                  ? "Requesting..."
                  : "Request Advocate Change"}
              </button>

            </div>
          )}

        </>
      )}

      {/* CONFIRM MODAL */}
      {confirmRequest && (
        <div className="confirm-overlay">
          <div className="confirm-box">

            <p>Are you sure you want to request advocate change?</p>

            <div className="confirm-actions">

              <button
                className="mycase-danger-btn"
                onClick={() => {
                  handleRequestChange();
                  setConfirmRequest(false);
                }}
              >
                Yes
              </button>

              <button
                className="mycase-primary-btn"
                onClick={() => setConfirmRequest(false)}
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default ClientAdvocates;