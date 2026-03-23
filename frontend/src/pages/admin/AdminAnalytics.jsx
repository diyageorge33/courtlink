import { useEffect, useState } from "react";
import { fetchAnalytics } from "../../api/adminApi";
import "../../newstyles.css";
import { useNavigate } from "react-router-dom";

function AdminAnalytics() {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setData(await fetchAnalytics());
    };
    load();
  }, []);

  return (
    <div className="client-dashboard-new">
      <button onClick={() => navigate(-1)} className="dashboard-btn-new">← Back</button>
      <h2>Analytics</h2>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default AdminAnalytics;