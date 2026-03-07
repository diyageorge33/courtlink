// import { useNavigate } from "react-router-dom";
// import Sidebar from "../../components/ClientSidebar";
// import { fetchClientDashboardStats } from "../../api/clientApi";
// import PayConsultation from "../../components/PayConsultation";
// import { useEffect, useState } from "react";

// function ClientDashboard() {
//   const navigate = useNavigate();

//   const userName = localStorage.getItem("userName") || "Client";

//   const [stats, setStats] = useState({
//     ongoingCases: 0,
//     upcomingHearings: 0,
//     closedCases: 0,
//     pendingPayments: 0,
//   });

//   const [consultationPaid, setConsultationPaid] = useState(false);
//   const [loading, setLoading] = useState(true);


//   useEffect(() => {
//   const loadData = async () => {
//     try {
//       // Load dashboard stats
//       const data = await fetchClientDashboardStats();
//       setStats(data);

//       const token = localStorage.getItem("token");

//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       // Check consultation payment status using JWT
//       const res = await fetch(
//         "http://localhost:5000/api/payment/consultation-status",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const paymentData = await res.json();

//       if (paymentData.consultation_paid) {
//         setConsultationPaid(true);
//       } else {
//         setConsultationPaid(false);
//       }

//     } catch (err) {
//       console.error("Error loading dashboard:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   loadData();
// }, []);

//   return (
//     <div className="client-layout">
//       <Sidebar />

//       <main className="client-content">
//         <div className="welcome-header">
//           <h1>Welcome, {userName}!</h1>

//           {consultationPaid && (
//             <span className="premium-badge">
//               💎 Premium Member
//             </span>
//           )}
//       </div>

//         <p className="dashboard-subtitle">
//           Here you can manage your cases, documents, and payments.
//         </p>

//         {loading ? (
//           <p>Loading dashboard...</p>
//         ) : (
//           <div className="stats-grid">
//             <div className="stat-card">
//               <h3>Ongoing Cases</h3>
//               <p>{stats.ongoingCases}</p>
//             </div>

//             <div className="stat-card">
//               <h3>Upcoming Hearings</h3>
//               <p>{stats.upcomingHearings}</p>
//             </div>

//             <div className="stat-card">
//               <h3>Closed Cases</h3>
//               <p>{stats.closedCases}</p>
//             </div>

//             <div className="stat-card">
//               <h3>Pending Payments</h3>
//               <p>₹ {stats.pendingPayments}</p>
//             </div>
//           </div>
//         )}

//         {/*  Consultation Payment Section */}
//         {!consultationPaid && (
//           <div className="action-card" style={{ marginBottom: "20px" }}>
//             <h3>Consultation Fee Required</h3>
//             <p>Please pay ₹500 to unlock advanced features.</p>
//             <PayConsultation />
//           </div>
//         )}

//         <div className="dashboard-section">
//           <h2>Quick Actions</h2>

//           <div className="actions-grid">
//             <div className="action-card">
//               <h3>File a New Case Request</h3>
//               <p>Submit a new legal case request to the firm.</p>
//               <button
//                 className="action-btn"
//                 onClick={() => navigate("/dashboard/client/filecase")}
//               >
//                 File Case
//               </button>
//             </div>

//             <div className="action-card">
//               <h3>Track Case Status</h3>
//               <p>Check updates and current progress of your cases.</p>
//               <button
//                   className={`action-btn ${!consultationPaid ? "unlocked" : ""}`}
//                   disabled={!consultationPaid}
//                   onClick={() => navigate("/dashboard/client/mycases")}
//                 >
//                   {consultationPaid ? "Track" : "🔒 Track (Premium)"}
//                 </button>
//             </div>

//             <div className="action-card">
//               <h3>Upload Documents</h3>
//               <p>Upload supporting documents for your case.</p>
//               <button
//                 className="action-btn"
//                 onClick={() => navigate("/dashboard/client/uploaddocuments")}
//               >
//                 Upload
//               </button>
//             </div>

//             <div className="action-card">
//               <h3>Download Orders</h3>
//               <p>Download court orders and judgement documents.</p>
//               <button
//                 className={`action-btn ${!consultationPaid ? "unlocked" : ""}`}
//                 disabled={!consultationPaid}
//                 onClick={() => navigate("/dashboard/client/downloadorders")}
//               >
//                 {consultationPaid ? "Download" : "🔒 Download (Premium)"}
//             </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default ClientDashboard;

// import { useNavigate } from "react-router-dom";
// import { fetchClientDashboardStats } from "../../api/clientApi";
// import PayConsultation from "../../components/PayConsultation";
// import { useEffect, useState } from "react";
// import { FaCog } from "react-icons/fa";

// function ClientDashboard() {
//   const navigate = useNavigate();
//   const userName = localStorage.getItem("userName") || "Client";

//   const [stats, setStats] = useState({
//     ongoingCases: 0,
//     upcomingHearings: 0,
//     closedCases: 0,
//     pendingPayments: 0,
//   });

//   const [consultationPaid, setConsultationPaid] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const data = await fetchClientDashboardStats();
//         setStats(data);

//         const token = localStorage.getItem("token");

//         const res = await fetch(
//           "http://localhost:5000/api/payment/consultation-status",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const paymentData = await res.json();
//         setConsultationPaid(paymentData.consultation_paid);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   return (
//     <div className="client-dashboard-new">

//       <div className="dashboard-header-new">

//         <div>
//           <h1>Welcome, {userName}</h1>
//           <p>Manage your cases and legal documents.</p>
//         </div>

//         <FaCog
//           className="settings-icon-new"
//           onClick={() => navigate("/dashboard/client/clientsetting")}
//         />

//       </div>

//       {!loading && (
//         <div className="stats-grid-new">

//           <div className="stat-card-new">
//             <h3>Ongoing Cases</h3>
//             <p>{stats.ongoingCases}</p>
//           </div>

//           <div className="stat-card-new">
//             <h3>Upcoming Hearings</h3>
//             <p>{stats.upcomingHearings}</p>
//           </div>

//           <div className="stat-card-new">
//             <h3>Closed Cases</h3>
//             <p>{stats.closedCases}</p>
//           </div>

//           <div className="stat-card-new">
//             <h3>Pending Payments</h3>
//             <p>₹ {stats.pendingPayments}</p>
//           </div>

//         </div>
//       )}

//       {!consultationPaid && (
//         <div className="action-card-new">
//           <h3>Consultation Fee Required</h3>
//           <p>Pay ₹500 to unlock premium features.</p>
//           <PayConsultation />
//         </div>
//       )}

//       <h2 className="section-title-new">Quick Actions</h2>

//       <div className="actions-grid-new">

//         <div className="action-card-new">
//           <h3>File Case</h3>
//           <p>Submit a new legal case request.</p>
//           <button onClick={() => navigate("/dashboard/client/filecase")}>
//             File Case
//           </button>
//         </div>

//         <div className="action-card-new">
//           <h3>AI Summarizer</h3>
//           <p>Summarize legal documents.</p>
//           <button
//             onClick={() => navigate("/dashboard/client/aisummarizer")}
//           >
//             Open
//           </button>
//         </div>

//         <div className="action-card-new">
//           <h3>Upload Documents</h3>
//           <p>Upload supporting documents.</p>
//           <button
//             onClick={() => navigate("/dashboard/client/uploaddocuments")}
//           >
//             Upload
//           </button>
//         </div>

        


//           <div className="action-card-new">
//           <h3>My Cases</h3>
//           <p>Track the status of your cases.</p>
//           <button
//             disabled={!consultationPaid}
//             onClick={() => navigate("/Mycase")}
//           >
//             {consultationPaid ? "Open" : "🔒 Premium"}
//           </button>
//         </div>

//         <div className="action-card-new">
//           <h3>AI Assistant</h3>
//           <p>Ask legal questions instantly.</p>
//           <button
//             onClick={() => navigate("/dashboard/client/aiassistant")}
//           >
//             Open
//           </button>
//         </div>


//       <div className="action-card-new">
//       <h3>My Documents</h3>
//       <p>View and manage all your uploaded documents.</p>
//       <button
//        onClick={() => navigate("/dashboard/client/document")}
//       >
//       View Documents
//       </button>
//       </div>

//         <div className="action-card-new">
//           <h3>Payment History</h3>
//           <p>View all your transactions.</p>
//           <button
//             onClick={() => navigate("/dashboard/client/paymenthistory")}
//           >
//             View
//           </button>
//         </div>


//       </div>

//     </div>
//   );
// }

// export default ClientDashboard;


import { useNavigate } from "react-router-dom";
import { fetchClientDashboardStats } from "../../api/clientApi";
import PayConsultation from "../../components/PayConsultation";
import { useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";
import "../../newstyles.css";

function ClientDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Client";

  const [stats, setStats] = useState({
    ongoingCases: 0,
    upcomingHearings: 0,
    closedCases: 0,
    pendingPayments: 0,
  });

  const [consultationPaid, setConsultationPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchClientDashboardStats();
        setStats(data);

        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/payment/consultation-status",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const paymentData = await res.json();
        setConsultationPaid(paymentData.consultation_paid);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="client-dashboard-new">

      {/* HEADER */}
      <div className="dashboard-header-new">

        <div>
          <h1>Welcome, {userName}</h1>
          <p>Manage your cases and legal documents.</p>
        </div>

        <FaCog
          className="settings-icon-new"
          onClick={() => navigate("/dashboard/client/clientsetting")}
        />

      </div>

      {/* STATS */}
      {!loading && (
        <div className="stats-grid-new">

          <div className="stat-card-new">
            <h3>Ongoing Cases</h3>
            <p>{stats.ongoingCases}</p>
          </div>

          <div className="stat-card-new">
            <h3>Upcoming Hearings</h3>
            <p>{stats.upcomingHearings}</p>
          </div>

          <div className="stat-card-new">
            <h3>Closed Cases</h3>
            <p>{stats.closedCases}</p>
          </div>

          <div className="stat-card-new">
            <h3>Pending Payments</h3>
            <p>₹ {stats.pendingPayments}</p>
          </div>

        </div>
      )}

      {/* CONSULTATION PAYMENT */}
      {!consultationPaid && (
        <div className="action-card-new">
          <h3>Consultation Fee Required</h3>
          <p>Pay ₹500 to unlock premium features.</p>
          <PayConsultation />
        </div>
      )}

      {/* QUICK ACTIONS */}
      <h2 className="section-title-new">Quick Actions</h2>

      <div className="actions-grid-new">

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/client/filecase")}
        >
          <h3>File Case</h3>
          <p>Submit a new legal case request.</p>
        </div>

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/client/aisummarizer")}
        >
          <h3>AI Summarizer</h3>
          <p>Summarize legal documents.</p>
        </div>

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/client/uploaddocuments")}
        >
          <h3>Upload Documents</h3>
          <p>Upload supporting documents.</p>
        </div>

        

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/client/paymenthistory")}
        >
          <h3>Payment History</h3>
          <p>View all your transactions.</p>
        </div>

        

        
        <div
          className={`action-tile-new ${!consultationPaid ? "tile-locked" : ""}`}
          onClick={() => consultationPaid && navigate("/Mycase")}
        >
          <h3>My Cases</h3>
          <p>
            {consultationPaid
              ? "Track the status of your cases."
              : "🔒 Premium Feature"}
          </p>
        </div>

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/client/aiassistant")}
        >
          <h3>AI Assistant</h3>
          <p>Ask legal questions instantly.</p>
        </div>

        <div
          className="action-tile-new"
          onClick={() => navigate("/dashboard/client/document")}
        >
          <h3>My Documents</h3>
          <p>View and manage uploaded documents.</p>
        </div>



        
      </div>

    </div>
  );
}

export default ClientDashboard;