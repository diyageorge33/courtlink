import { useEffect, useState } from "react";
import "../../newstyles.css";

function AdminDashboard() {

  const [view,setView] = useState("dashboard");

  const [clients,setClients] = useState([]);
  const [advocates,setAdvocates] = useState([]);
  const [cases,setCases] = useState([]);

  const [clientCases,setClientCases] = useState([]);
  const [selectedClient,setSelectedClient] = useState(null);
  const [selectedCase,setSelectedCase] = useState(null);
  const [suggestedAdvocates,setSuggestedAdvocates] = useState([]);


  const token = localStorage.getItem("token");

  /* FETCH DATA */

  useEffect(()=>{

    fetch("http://localhost:5000/api/admin/clients",{
      headers:{ Authorization:`Bearer ${token}` }
    })
    .then(res=>res.json())
    .then(data=>setClients(data));

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

    alert("Advocate Assigned");

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

  return(

  <div className="client-dashboard-new">

  <h1>Admin Dashboard</h1>


  {/* DASHBOARD CARDS */}

  {view === "dashboard" && (

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
    </tr>
  </thead>

  <tbody>

  {advocates.map(a=>(

    <tr key={a.user_id}>
      <td>{a.full_name}</td>
      <td>{a.specialization}</td>
      <td>{a.experience_years} years</td>
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

    </tr>

  ))}

  </tbody>

  </table>

  </div>

  )}

  {/* CASE DETAILS */}

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
  </div>

  );

}

export default AdminDashboard;