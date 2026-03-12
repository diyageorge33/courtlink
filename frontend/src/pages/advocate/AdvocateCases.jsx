import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.headers.common["Authorization"] =
  `Bearer ${localStorage.getItem("token")}`;

function AdvocateCases() {

  const [cases, setCases] = useState([]);
  const navigate = useNavigate();
  const advocateId = localStorage.getItem("user_id");

  useEffect(() => {
  const fetchCases = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/advocate/cases/${advocateId}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      const statusOrder = {
        PENDING: 1,
        ONGOING: 2,
        CLOSED: 3,
      };

      const sortedCases = res.data.sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status]
      );

      setCases(sortedCases);

    } catch (err) {
      console.error("Error fetching cases:", err);
    }
  };

  fetchCases();
}, [advocateId]);


const deleteCase = async (caseId) => {

  try {

    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/advocate/delete-case/${caseId}`,
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    setCases(cases.filter(c => c.case_id !== caseId));

  } catch (err) {

    console.error(err);
    alert("Error deleting case");

  }

};
 
  return (
    <div>
      <h2>My Cases</h2>
      <table className="cases-table">
        <thead>
          <tr>
            <th>SL No</th>
            <th>Case Title</th>
            <th>Case Type</th>
            <th>Status</th>
            <th>Next Hearing</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c, index) => (
            <tr key={c.case_id}>
              <td>{index + 1}</td>
              <td>{c.case_title}</td>
              <td>{c.case_type}</td>
              <td>
                <span className={`status ${c.status.toLowerCase()}`}>
                  {c.status}
                </span>
              </td>
              <td>
                {c.next_hearing_date
                  ? new Date(c.next_hearing_date).toLocaleDateString()
                  : "Not Scheduled"}
              </td>
              <td>
                {new Date(c.created_at).toLocaleDateString()}
              </td>
              <td>
                <button
                  className="view-btn"
                  onClick={() => navigate(`/dashboard/advocate/case/${c.case_id}`)}
                >
                  View
                </button>
                <button
                  className="hearing-btn"
                  disabled={c.status === "CLOSED"}
                  onClick={() =>
                    navigate(`/dashboard/advocate/hearings?case=${c.case_id}`)
                  }
                >
                  Schedule
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteCase(c.case_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdvocateCases;