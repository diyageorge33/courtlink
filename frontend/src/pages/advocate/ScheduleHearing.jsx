import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../newstyles.css";

function ScheduleHearing() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [caseId, setCaseId] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const caseParam = searchParams.get("case");
    if (caseParam) {
      setCaseId(caseParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caseId || !date) {
      toast.warn("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/advocate/schedule-hearing/${caseId}`,
        { hearing_date: date },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Hearing scheduled successfully");
      navigate("/dashboard/advocate/cases");

    } catch (err) {
      console.error("FULL ERROR:", err);
      console.error("SERVER ERROR:", err.response?.data);
      toast.error("Error scheduling hearing");
    }
  };

  return (
    <div className="client-dashboard-new">

      <div className="documents-header-new">
        <h1 className="page-title-new">Schedule Hearing</h1>

        <div className="documents-header-buttons">
          <button
            className="dashboard-btn-new"
            onClick={() => navigate("/dashboard/advocate")}
          >
            ← Dashboard
          </button>
        </div>
      </div>

      <div className="upload-box-new">
        <div className="form-card-new">

          <form onSubmit={handleSubmit}>

            <label>Case ID</label>
            <input
              type="number"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="Enter Case ID"
              required
            />

            <label>Hearing Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <button type="submit" className="primary-btn-new">
              Schedule Hearing
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}

export default ScheduleHearing;