import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

function ScheduleHearing() {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [caseId, setCaseId] = useState("");
  const [date, setDate] = useState("");

  // Autofill Case ID if coming from My Cases
  useEffect(() => {
    const caseParam = searchParams.get("case");
    if (caseParam) {
      setCaseId(caseParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caseId || !date) {
      alert("Please fill all fields");
      return;
    }

    try {

      await axios.put(
        `http://localhost:5000/api/advocate/schedule-hearing/${caseId}`,
        { hearing_date: date }
      );

      alert("Hearing scheduled successfully");

      // redirect back to My Cases
      navigate("/dashboard/advocate/cases");

    } catch (err) {
      console.error("FULL ERROR:", err);
      console.error("SERVER ERROR:", err.response?.data);
      alert("Error scheduling hearing");
    }
  };

  return (
    <DashboardLayout role="advocate">

      <div className="add-case-wrapper">

        <div className="add-case-card">

          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Schedule Hearing
          </h2>

          <form onSubmit={handleSubmit} className="add-case-form">

            <div className="form-group">
              <label>Case ID</label>
              <input
                type="number"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Hearing Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Schedule Hearing
            </button>

          </form>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default ScheduleHearing;  