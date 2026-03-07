import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchClientAdvocates } from "../api/clientApi";
import "../newstyles.css";

function MyAdvocates() {

  const navigate = useNavigate();

  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadAdvocates = async () => {

      try {

        const data = await fetchClientAdvocates();
        setAdvocates(data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

    loadAdvocates();

  }, []);

  return (

    <div className="client-dashboard-new">

      <div className="documents-header-new">

        <h1 className="page-title-new">My Advocates</h1>

        <button
          className="dashboard-btn-new"
          onClick={() => navigate("/dashboard/client")}
        >
          ← Dashboard
        </button>

      </div>

      {loading ? (

        <p>Loading advocates...</p>

      ) : advocates.length === 0 ? (

        <p>No advocates assigned yet.</p>

      ) : (

        <div className="cases-table-wrapper-new">

          <table className="cases-table-new">

            <thead>
              <tr>
                <th>Advocate ID</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Phone</th>
              </tr>
            </thead>

            <tbody>

              {advocates.map((a) => (

                <tr key={a.advocate_id}>

                  <td>{a.advocate_id}</td>
                  <td>{a.full_name}</td>
                  <td>{a.specialization || "N/A"}</td>
                  <td>{a.experience_years || 0} yrs</td>
                  <td>{a.phone || "N/A"}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}

export default MyAdvocates;