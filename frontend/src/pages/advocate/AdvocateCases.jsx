import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../layouts/DashboardLayout";

function AdvocateCases() {
  const [cases, setCases] = useState([]);
  const advocateId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/advocate/cases/${advocateId}`
        );
        setCases(res.data);
      } catch (err) {
        console.error("Error fetching cases:", err);
      }
    };

    fetchCases();
  }, [advocateId]);

  return (
    <DashboardLayout role="advocate">
      <h2>My Cases</h2>

      <table className="cases-table">
        <thead>
          <tr>
            <th>Case Title</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.case_id}>
              <td>{c.case_title}</td>
              <td>{c.status}</td>
              <td>{new Date(c.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}

export default AdvocateCases;
