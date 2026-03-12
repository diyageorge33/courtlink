import { useEffect, useState } from "react";
import "../../newstyles.css";
import { toast } from "react-toastify";

function AdminDashboard() {

const [view,setView] = useState("dashboard");

const [clients,setClients] = useState([]);
const [advocates,setAdvocates] = useState([]);
const [cases,setCases] = useState([]);

const [statusFilter,setStatusFilter] = useState("ALL");
const [caseSearch,setCaseSearch] = useState("");

const [clientCases,setClientCases] = useState([]);
const [selectedClient,setSelectedClient] = useState(null);
const [selectedCase,setSelectedCase] = useState(null);
const [suggestedAdvocates,setSuggestedAdvocates] = useState([]);

const [closedCases,setClosedCases] = useState([]);
const [pendingCases,setPendingCases] = useState([]);

const [stats,setStats] = useState({
totalCases:0,
activeCases:0,
closedCases:0,
totalAdvocates:0,
pendingCases:0
});

const [currentPage,setCurrentPage] = useState(1);
const [totalClients,setTotalClients] = useState(0);

const token = localStorage.getItem("token");

/* FETCH CLIENTS */

const fetchClients = async(page=1)=>{

const res = await fetch(
`http://localhost:5000/api/admin/clients?page=${page}`,
{headers:{Authorization:`Bearer ${token}`}}
);

const data = await res.json();

setClients(data.clients);
setTotalClients(data.total);
setCurrentPage(page);

};

/* INITIAL DATA */

useEffect(()=>{

fetchClients();

fetch("http://localhost:5000/api/admin/advocates",{headers:{Authorization:`Bearer ${token}`}})
.then(res=>res.json())
.then(data=>setAdvocates(data));

fetch("http://localhost:5000/api/admin/cases",{headers:{Authorization:`Bearer ${token}`}})
.then(res=>res.json())
.then(data=>setCases(data));

fetch("http://localhost:5000/api/admin/closed-cases",{headers:{Authorization:`Bearer ${token}`}})
.then(res=>res.json())
.then(data=>setClosedCases(data));

fetch("http://localhost:5000/api/admin/stats",{headers:{Authorization:`Bearer ${token}`}})
.then(res=>res.json())
.then(data=>setStats(data));

fetch("http://localhost:5000/api/admin/pending-cases",{headers:{Authorization:`Bearer ${token}`}})
.then(res=>res.json())
.then(data=>setPendingCases(data));

},[]);


/* CLIENT CASES */

const fetchClientCases = async(client)=>{

const res = await fetch(
`http://localhost:5000/api/admin/client-cases/${client.user_id}`,
{headers:{Authorization:`Bearer ${token}`}}
);

const data = await res.json();

setSelectedClient(client);
setClientCases(data);
setView("clientCases");

};


/* ASSIGN ADVOCATE */

const assignAdvocate = async(caseId,advocateId)=>{

if(!advocateId || advocateId === "Select Advocate") return;

await fetch("http://localhost:5000/api/admin/assign",{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({caseId,advocateId})
});

toast.success("Advocate Assigned");

// Refetch the cases to legally update the UI state
const res = await fetch("http://localhost:5000/api/admin/cases",{headers:{Authorization:`Bearer ${token}`}});
const data = await res.json();
setCases(data);

};


/* CLOSE CASE */

const closeCase = async(caseId)=>{

await fetch(
`http://localhost:5000/api/admin/close-case/${caseId}`,
{method:"PUT",headers:{Authorization:`Bearer ${token}`}}
);

toast.success("Case closed successfully");
window.location.reload();

};

/* REOPEN CASE */

const reopenCase = async(caseId)=>{

await fetch(
`http://localhost:5000/api/admin/reopen-case/${caseId}`,
{method:"PUT",headers:{Authorization:`Bearer ${token}`}}
);

toast.success("Case reopened successfully");
window.location.reload();

};


/* CASE REVIEW */

const fetchPendingCases = async()=>{
const res = await fetch("http://localhost:5000/api/admin/pending-cases",{headers:{Authorization:`Bearer ${token}`}});
const data = await res.json();
setPendingCases(data);
};

const approveCaseReview = async(caseId)=>{
await fetch(`http://localhost:5000/api/admin/approve-case/${caseId}`,{
method:"PUT",
headers:{Authorization:`Bearer ${token}`}
});
toast.success("Case Approved");
fetchPendingCases();
// Update stats
fetch("http://localhost:5000/api/admin/stats",{headers:{Authorization:`Bearer ${token}`}})
.then(res=>res.json())
.then(data=>setStats(data));
};

const rejectCaseReview = async(caseId)=>{
await fetch(`http://localhost:5000/api/admin/reject-case/${caseId}`,{
method:"PUT",
headers:{Authorization:`Bearer ${token}`}
});
toast.success("Case Rejected");
fetchPendingCases();
// Update stats
fetch("http://localhost:5000/api/admin/stats",{headers:{Authorization:`Bearer ${token}`}})
.then(res=>res.json())
.then(data=>setStats(data));
};


/* DELETE ADVOCATE */

const deleteAdvocate = async(advocateId)=>{

const res = await fetch(
`http://localhost:5000/api/admin/delete-advocate/${advocateId}`,
{method:"DELETE",headers:{Authorization:`Bearer ${token}`}}
);

const data = await res.json();

if(!res.ok){
toast.error(data.message);
return;
}

toast.success("Advocate deactivated successfully");

const updated = await fetch(
"http://localhost:5000/api/admin/advocates",
{headers:{Authorization:`Bearer ${token}`}}
);

const advocatesData = await updated.json();
setAdvocates(advocatesData);

};


/* RESTORE ADVOCATE */

const restoreAdvocate = async(advocateId)=>{

const res = await fetch(
`http://localhost:5000/api/admin/restore-advocate/${advocateId}`,
{method:"PUT",headers:{Authorization:`Bearer ${token}`}}
);

const data = await res.json();

if(!res.ok){
toast.error(data.message);
return;
}

toast.success("Advocate restored successfully");

const updated = await fetch(
"http://localhost:5000/api/admin/advocates",
{headers:{Authorization:`Bearer ${token}`}}
);

const advocatesData = await updated.json();
setAdvocates(advocatesData);

};


return(

<div className="client-dashboard-new">

<h1>Admin Dashboard</h1>


{/* DASHBOARD */}

{view==="dashboard" &&(

<div>

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

<div className="actions-grid-new">

<div className="action-tile-new" onClick={()=>setView("clients")}>
<h3>Clients</h3>
<p>View registered clients</p>
</div>

<div className="action-tile-new" onClick={()=>setView("advocates")}>
<h3>Advocates</h3>
<p>{stats.totalAdvocates} registered advocates</p>
</div>

<div className="action-tile-new" onClick={()=>setView("review")}>
<h3>Case Review</h3>
<p>{stats.pendingCases} cases pending</p>
</div>

<div className="action-tile-new" onClick={()=>setView("cases")}>
<h3>Case Assignment</h3>
<p>Assign advocates to cases</p>
</div>

<div className="action-tile-new" onClick={()=>setView("closedCases")}>
<h3>Closed Cases</h3>
<p>View completed cases</p>
</div>

</div>

</div>

)}


{/* CLIENT LIST */}

{view==="clients" &&(

<div>

<button className="dashboard-btn-new" onClick={()=>setView("dashboard")}>← Back</button>

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
onClick={()=>fetchClientCases(c)}
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


{/* CLIENT CASES DETAILS */}

{view==="clientCases" &&(

<div>

<button className="dashboard-btn-new" onClick={()=>setView("clients")}>← Back to Clients</button>

{selectedClient && (
  <div style={{ background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
    <h2 style={{ marginBottom: "5px" }}>{selectedClient.full_name}</h2>
    <p style={{ color: "#aaa" }}>{selectedClient.email}</p>
  </div>
)}

<h3>Cases Filed</h3>

{clientCases.length === 0 ? (
  <p style={{ color: "#aaa", marginTop: "15px" }}>No cases found for this client.</p>
) : (
  <table className="cases-table-new">
    <thead>
      <tr>
        <th>Case Title</th>
        <th>Type</th>
        <th>Status</th>
        <th>Assigned Advocate</th>
      </tr>
    </thead>
    <tbody>
      {clientCases.map(c=>(
        <tr key={c.case_id}>
          <td>{c.case_title}</td>
          <td>{c.case_type}</td>
          <td>{c.status}</td>
          <td>{c.advocate_name || "Not Assigned"}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}

</div>

)}


{/* ADVOCATES */}

{view==="advocates" &&(

<div>

<button className="dashboard-btn-new" onClick={()=>setView("dashboard")}>← Back</button>

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

{advocates.map(a=>(

<tr key={a.user_id}>

<td>{a.full_name}</td>
<td>{a.specialization}</td>
<td>{a.experience_years} years</td>

<td>{a.is_active ? "Active" : "Inactive"}</td>

<td>

{a.is_active ?

<button className="delete-btn-new" onClick={()=>deleteAdvocate(a.user_id)}>
Deactivate
</button>

:

<button className="dashboard-btn-new" onClick={()=>restoreAdvocate(a.user_id)}>
Restore
</button>

}

</td>

</tr>

))}

</tbody>

</table>

</div>

)}


{/* CASE ASSIGNMENT */}

{view==="cases" &&(

<div>

<button className="dashboard-btn-new" onClick={()=>setView("dashboard")}>← Back</button>

<h2>Case Assignment</h2>

<input
type="text"
placeholder="Search cases..."
value={caseSearch}
onChange={(e)=>setCaseSearch(e.target.value)}
style={{padding:"8px",width:"250px",marginBottom:"15px"}}
/>

<select
value={statusFilter}
onChange={(e)=>setStatusFilter(e.target.value)}
>

<option value="ALL">All Cases</option>
<option value="PENDING">Pending</option>
<option value="ONGOING">Ongoing</option>
<option value="CLOSED">Closed</option>
<option value="REJECTED">Rejected</option>

</select>

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

{cases
.filter(c =>
(statusFilter==="ALL" || c.status===statusFilter) &&
(c.case_title || "").toLowerCase().includes(caseSearch.toLowerCase())
)
.map(c=>(

<tr key={c.case_id}>

<td>{c.case_title}</td>
<td>{c.client_name}</td>
<td>{c.status}</td>

<td>

{c.status==="REJECTED" || c.status==="CLOSED" ?

<span>Not Allowed</span>

: c.status==="PENDING" ?

<span style={{color:"#ca8a04",fontWeight:"500"}}>Needs Approval</span>

: c.advocate_id ? 

<span>Assigned: {c.advocate_name}</span>

:

<select onChange={(e)=>assignAdvocate(c.case_id,e.target.value)}>

<option>Select Advocate</option>

{advocates
.filter(a=>a.is_active)
.map(a=>(

<option key={a.user_id} value={a.user_id}>
{a.full_name} ({a.specialization})
</option>

))}

</select>

}

</td>

<td>

{c.status==="CLOSED" ?

<button onClick={()=>reopenCase(c.case_id)}>
Reopen
</button>

:

<button onClick={()=>closeCase(c.case_id)}>
Close
</button>

}

</td>

</tr>

))}

</tbody>

</table>

</div>

)}


{/* CLOSED CASES */}

{view==="closedCases" &&(

<div>

<button className="dashboard-btn-new" onClick={()=>setView("dashboard")}>← Back</button>

<h2>Closed Cases</h2>

<table className="cases-table-new">

<thead>
<tr>
<th>ID</th>
<th>Title</th>
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
<td>{c.advocate_name || "Not Assigned"}</td>

</tr>

))}

</tbody>

</table>

</div>

)}

{/* CASE REVIEW VIEW */}

{view==="review" &&(

<div>

<button className="dashboard-btn-new" onClick={()=>setView("dashboard")}>← Back</button>

<h2>Cases for Review</h2>

<p style={{color:"#aaa",marginBottom:"20px"}}>These cases have been filed by clients and are awaiting your approval.</p>

{pendingCases.length === 0 ? (
  <p style={{color:"#aaa",marginTop:"20px"}}>No cases currently awaiting review.</p>
) : (
  <table className="cases-table-new">
    <thead>
      <tr>
        <th>Client</th>
        <th>Case Title</th>
        <th>Type</th>
        <th>Description</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {pendingCases.map(c=>(
        <tr key={c.case_id}>
          <td>{c.client_name}</td>
          <td>{c.case_title}</td>
          <td>{c.case_type}</td>
          <td>{c.case_description}</td>
          <td>
            <button className="dashboard-btn-new" style={{background:"#16a34a",marginRight:"5px"}} onClick={()=>approveCaseReview(c.case_id)}>Approve</button>
            <button className="delete-btn-new" onClick={()=>rejectCaseReview(c.case_id)}>Reject</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}

</div>

)}

</div>

);

}

export default AdminDashboard;