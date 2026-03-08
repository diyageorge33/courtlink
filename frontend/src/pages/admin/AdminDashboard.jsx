import { useEffect, useState } from "react";
import "../../newstyles.css";
import { toast } from "react-toastify";

function AdminDashboard() {

  const [view,setView] = useState("dashboard");

  const [clients,setClients] = useState([]);
  const [advocates,setAdvocates] = useState([]);
  const [cases,setCases] = useState([]);

  const [clientCases,setClientCases] = useState([]);
  const [selectedClient,setSelectedClient] = useState(null);
  const [selectedCase,setSelectedCase] = useState(null);
  const [suggestedAdvocates,setSuggestedAdvocates] = useState([]);
  const [closedCases,setClosedCases] = useState([]);
  const [stats,setStats] = useState({
    totalCases:0,
    activeCases:0,
    closedCases:0,
    totalAdvocates:0
});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalClients, setTotalClients] = useState(0);

  const token = localStorage.getItem("token");

  const fetchClients = async(page = 1) => {

    const res = await fetch(
        `http://localhost:5000/api/admin/clients?page=${page}`,
        {
        headers: { Authorization: `Bearer ${token}` }
        }
    );

    const data = await res.json();

    setClients(data.clients);
    setTotalClients(data.total);
    setCurrentPage(page);

};

  /* FETCH DATA */

  useEffect(()=>{

    fetchClients();

    fetch("http://localhost:5000/api/admin/advocates",{
      headers:{ Authorization:`Bearer ${token}` }
    })
    .then(res=>res.json())
    .then(data=>setAdvocates(data));

    fetch("http://localhost:5000/api/admin/cases",{
      headers:{ Authorization:`Bearer ${token}` }
    })
    .then(res=>res.json())
    .then(data=>setCases(data));

    fetch("http://localhost:5000/api/admin/closed-cases",{
      headers:{ Authorization:`Bearer ${token}` }
    })
    .then(res=>res.json())
    .then(data=>setClosedCases(data));

    fetch("http://localhost:5000/api/admin/stats",{
      headers:{ Authorization:`Bearer ${token}` }
    })
    .then(res=>res.json())
    .then(data=>setStats(data));

  },[]);


  /* FETCH CLIENT CASES */

  const fetchClientCases = async(clientId)=>{

    const res = await fetch(
      `http://localhost:5000/api/admin/client-cases/${clientId}`,
      {
        headers:{ Authorization:`Bearer ${token}` }
      }
    );

    const data = await res.json();

    setClientCases(data);
    setSelectedClient(clientId);
    setView("clientCases");

  };


  /* ASSIGN ADVOCATE */

  const assignAdvocate = async(caseId,advocateId)=>{

    await fetch("http://localhost:5000/api/admin/assign",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify({caseId,advocateId})
    });

    toast.success("Advocate Assigned");

  };

    const openCaseDetails = async(caseData)=>{

        setSelectedCase(caseData);
        const res = await fetch(
            `http://localhost:5000/api/admin/suggest-advocates/${caseData.case_id}`,
            {
            headers:{ Authorization:`Bearer ${token}` }
            }
        );
        const data = await res.json();

        setSuggestedAdvocates(data);
        setView("caseDetails");
    };

    const closeCase = async (caseId) => {

        await fetch(
                `http://localhost:5000/api/admin/close-case/${caseId}`,
                {
                method:"PUT",
                headers:{
                    Authorization:`Bearer ${token}`
                }
                }
        );

        toast.success("Case closed successfully");

        window.location.reload();

    };

    const reopenCase = async (caseId) => {

        await fetch(
            `http://localhost:5000/api/admin/reopen-case/${caseId}`,
            {
            method:"PUT",
            headers:{
                Authorization:`Bearer ${token}`
            }
            }
        );

        toast.success("Case reopened successfully");

        window.location.reload();

    };

    const deleteAdvocate = async (advocateId) => {

        const res = await fetch(
            `http://localhost:5000/api/admin/delete-advocate/${advocateId}`,
            {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        );

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message);
            return;
        }

        toast.success("Advocate deactivated successfully");

        /* REFRESH ADVOCATE LIST */

        const updated = await fetch(
            "http://localhost:5000/api/admin/advocates",
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        );

        const advocatesData = await updated.json();

        setAdvocates(advocatesData);

    };

   const restoreAdvocate = async (advocateId) => {

        const res = await fetch(
            `http://localhost:5000/api/admin/restore-advocate/${advocateId}`,
            {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        );

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message);
            return;
        }

        toast.success("Advocate restored successfully");

        const updated = await fetch(
            "http://localhost:5000/api/admin/advocates",
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        );

        const advocatesData = await updated.json();

        setAdvocates(advocatesData);

    };

  return(

  <div className="client-dashboard-new">

  <h1>Admin Dashboard</h1>


  {/* DASHBOARD CARDS */}

  {view === "dashboard" && (

<div>

{/* ADMIN ANALYTICS STATS */}

<div className="stats-grid-new">

<div className="stat-card-new">
<h3>Total Cases</h3>
<p>{stats.totalCases}</p>
</div>

<div className="stat-card-new">
<h3>Active Cases</h3>
<p>{stats.activeCases}</p>
</div>

<div className="stat-card-new">
<h3>Closed Cases</h3>
<p>{stats.closedCases}</p>
</div>

<div className="stat-card-new">
<h3>Total Advocates</h3>
<p>{stats.totalAdvocates}</p>
</div>

</div>


{/* DASHBOARD ACTION CARDS */}

<div className="actions-grid-new">

<div
className="action-tile-new"
onClick={()=>setView("clients")}
>
<h3>Clients</h3>
<p>View registered clients</p>
</div>

<div
className="action-tile-new"
onClick={()=>setView("advocates")}
>
<h3>Advocates</h3>
<p>View advocates in firm</p>
</div>

<div
className="action-tile-new"
onClick={()=>setView("cases")}
>
<h3>Case Assignment</h3>
<p>Assign advocate to cases</p>
</div>

<div
className="action-tile-new"
onClick={()=>setView("closedCases")}
>
<h3>Closed Cases</h3>
<p>View completed cases</p>
</div>

</div>

</div>

)}


  {/* CLIENT LIST */}

  {view === "clients" && (

  <div>

  <button
  className="dashboard-btn-new"
  onClick={()=>setView("dashboard")}
  >
  ← Back
  </button>

  <h2>Clients</h2>

  <table className="cases-table-new">

  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
    </tr>
  </thead>

  <tbody>

  {clients.map(c=>(

    <tr key={c.user_id}>

      <td
        style={{cursor:"pointer",color:"#3b82f6"}}
        onClick={()=>fetchClientCases(c.user_id)}
      >
        {c.full_name}
      </td>

      <td>{c.email}</td>

    </tr>

  ))}

  </tbody>

  </table>

  <div style={{marginTop:"20px"}}>

<button
className="dashboard-btn-new"
disabled={currentPage === 1}
onClick={()=>fetchClients(currentPage - 1)}
>
Previous
</button>

<span style={{margin:"0 15px"}}>
Page {currentPage}
</span>

<button
className="dashboard-btn-new"
disabled={currentPage * 10 >= totalClients}
onClick={()=>fetchClients(currentPage + 1)}
>
Next
</button>

</div>

  </div>

  )}


  {/* CLIENT CASES */}

  {view === "clientCases" && (

  <div>

  <button
  className="dashboard-btn-new"
  onClick={()=>setView("clients")}
  >
  ← Back
  </button>

  <h2>Client Cases</h2>

  <table className="cases-table-new">

  <thead>

  <tr>
    <th>Case Title</th>
    <th>Type</th>
    <th>Status</th>
    <th>Advocate</th>
  </tr>

  </thead>

  <tbody>

  {clientCases.map(c=>(
    <tr key={c.case_id}>

      <td
      style={{cursor:"pointer",color:"#3b82f6"}}
      onClick={()=>openCaseDetails(c)}
      >
        {c.case_title}
      </td>
      <td>{c.case_type}</td>
      <td>{c.status}</td>

      <td>
        {c.advocate_name
          ? c.advocate_name
          : "Advocate not assigned"}
      </td>

    </tr>
  ))}

  </tbody>

  </table>

  </div>

  )}


  {/* ADVOCATES */}

  {view === "advocates" && (

  <div>

  <button
  className="dashboard-btn-new"
  onClick={()=>setView("dashboard")}
  >
  ← Back
  </button>

  <h2>Advocates</h2>

  <table className="cases-table-new">

  <thead>
    <tr>
      <th>Name</th>
      <th>Specialization</th>
      <th>Experience</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>

  {advocates.map(a => (

        <tr key={a.user_id}>

        <td>{a.full_name}</td>

        <td>{a.specialization}</td>

        <td>{a.experience_years} years</td>

        <td>
        <span
        style={{
        background: a.is_active ? "#16a34a" : "#ef4444",
        padding: "4px 10px",
        borderRadius: "6px",
        color: "white",
        fontSize: "12px"
        }}
        >
        {a.is_active ? "Active" : "Inactive"}
        </span>
        </td>

        <td>

        {a.is_active ? (

        <button
        className="delete-btn-new"
        onClick={() => deleteAdvocate(a.user_id)}
        >
        Deactivate
        </button>

        ) : (

        <button
        className="dashboard-btn-new"
        onClick={() => restoreAdvocate(a.user_id)}
        >
        Restore
        </button>

        )}

        </td>

        </tr>

    ))}
  </tbody>

  </table>

  </div>

  )}


  {/* CASE ASSIGNMENT */}

  {view === "cases" && (

  <div>

  <button
  className="dashboard-btn-new"
  onClick={()=>setView("dashboard")}
  >
  ← Back
  </button>

  <h2>Case Assignment</h2>

  <table className="cases-table-new">

  <thead>

  <tr>
    <th>Case</th>
    <th>Client</th>
    <th>Status</th>
    <th>Assign Advocate</th>
    <th>Close Case</th>
  </tr>

  </thead>

  <tbody>

  {cases.map(c=>(

    <tr key={c.case_id}>

      <td>{c.case_title}</td>
      <td>{c.client_name}</td>
      <td>{c.status}</td>

      <td>

        <select
        onChange={(e)=>assignAdvocate(c.case_id,e.target.value)}
        >

        <option>Select Advocate</option>

        {advocates.map(a=>(

          <option
          key={a.user_id}
          value={a.user_id}
          >
          {a.full_name} ({a.specialization})
          </option>

        ))}

        </select>

      </td>

     <td>

        {c.status === "CLOSED" ? (

            <button
            className="dashboard-btn-new"
            onClick={()=>reopenCase(c.case_id)}
            >

            Reopen Case

            </button>

            ) : (

            <button
            className="dashboard-btn-new"
            onClick={()=>closeCase(c.case_id)}
            >

            Close Case

            </button>

        )}

    </td>

    </tr>

  ))}

  </tbody>

  </table>

  </div>

  )}



{/* CASE DETAILS */}

{view === "caseDetails" && selectedCase && (

<div>

<button
className="dashboard-btn-new"
onClick={()=>setView("clientCases")}
>
← Back
</button>

<h2>Case Details</h2>

<div className="case-description-card">

<h3>{selectedCase.case_title}</h3>

<p><strong>Type:</strong> {selectedCase.case_type}</p>

<p><strong>Status:</strong> {selectedCase.status}</p>

<p>
<strong>Previous Advocate:</strong>{" "}
{selectedCase.previous_advocate
  ? selectedCase.previous_advocate
  : "None"}
</p>

<p>
<strong>Assigned Advocate:</strong>{" "}
{selectedCase.advocate_name
  ? selectedCase.advocate_name
  : "Advocate not assigned"}
</p>

<hr/>

<p><strong>Description:</strong></p>

<p>{selectedCase.case_description}</p>

<hr/>

<h3>Assign / Reassign Advocate</h3>

<select
onChange={(e)=>assignAdvocate(selectedCase.case_id,e.target.value)}
>

<option>Select Advocate</option>

{advocates.map(a=>(

<option key={a.user_id} value={a.user_id}>

{a.full_name} ({a.specialization})

</option>

))}

</select>

<hr/>

<h3>AI Suggested Advocates</h3>

{suggestedAdvocates.length === 0 && (
<p>No recommended advocates for this case.</p>
)}

{suggestedAdvocates.map(a=>(

<div
key={a.advocate_id}
style={{
marginBottom:"12px",
padding:"10px",
border:"1px solid #334155",
borderRadius:"8px"
}}
>

<p>

<strong>{a.full_name}</strong>

<br/>

Specialization: {a.specialization}

<br/>

Experience: {a.experience_years} years

</p>

<button
className="dashboard-btn-new"
onClick={()=>assignAdvocate(selectedCase.case_id,a.advocate_id)}
>
Assign Advocate
</button>

</div>

))}

</div>

</div>

)}

    {/* CLOSED CASES */}

{view === "closedCases" && (

    <div>

    <button
    className="dashboard-btn-new"
    onClick={()=>setView("dashboard")}
    >
    ← Back
    </button>

    <h2>Closed Cases</h2>

    <table className="cases-table-new">

    <thead>
    <tr>
    <th>Case ID</th>
    <th>Case Title</th>
    <th>Type</th>
    <th>Client</th>
    <th>Advocate</th>
    </tr>
    </thead>

    <tbody>

    {closedCases.map(c=>(

    <tr key={c.case_id}>

    <td>{c.case_id}</td>

    <td>{c.case_title}</td>

    <td>{c.case_type}</td>

    <td>{c.client_name}</td>

    <td>
    {c.advocate_name
    ? c.advocate_name
    : "Not Assigned"}
    </td>

    </tr>

    ))}

    </tbody>

    </table>

    </div>

)}

  </div>

  );

}

export default AdminDashboard;