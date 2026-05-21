import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { toast } from "react-toastify";

import "../../newstyles.css";
import {
  approveAdminAdvocateClosure,
  approveAdminCase,
  approveAdminClientClosure,
  approvePendingAdminAdvocate,
  assignAdminAdvocate,
  closeAdminCase,
  deleteAdminAdvocate,
  fetchAdminAdvocates,
  fetchAdminAnalytics,
  fetchAdminCases,
  fetchAdminCaseTimeline,
  fetchAdminClientCases,
  fetchAdminClients,
  fetchAdminClosedCases,
  fetchAdminClosureRequests,
  fetchAdminPendingCases,
  fetchAdminStats,
  fetchPendingAdminAdvocates,
  reassignAdminAdvocate,
  rejectAdminAdvocateClosure,
  rejectAdminCase,
  rejectAdminClientClosure,
  rejectPendingAdminAdvocate,
  reopenAdminCase,
  restoreAdminAdvocate,
} from "../../api/adminApi";
import AdminOverview from "./AdminOverview";
import AnalyticsView from "./AnalyticsView";
import AdvocatesView from "./AdvocatesView";
import CaseAssignmentView from "./CaseAssignmentView";
import CaseReviewView from "./CaseReviewView";
import ClientCasesView from "./ClientCasesView";
import ClientsView from "./ClientsView";
import ClosedCasesView from "./ClosedCasesView";
import ClosureRequestsView from "./ClosureRequestsView";
import PendingAdvocatesView from "./PendingAdvocatesView";

function AdminDashboard() {
  const [view, setView] = useState("dashboard");
  const [clients, setClients] = useState([]);
  const [advocates, setAdvocates] = useState([]);
  const [cases, setCases] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [caseSearch, setCaseSearch] = useState("");
  const [clientCases, setClientCases] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [closedCases, setClosedCases] = useState([]);
  const [pendingCases, setPendingCases] = useState([]);
  const [pendingAdvocates, setPendingAdvocates] = useState([]);
  const [closureRequests, setClosureRequests] = useState({
  clients: [],
  advocates: [],
  closedClients: [], 
    });
  const [analyticsData, setAnalyticsData] = useState(null);
  const [caseTimeline, setCaseTimeline] = useState([]);
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    closedCases: 0,
    totalAdvocates: 0,
    pendingCases: 0,
  });

  const fetchClients = async (page = 1) => {
    try {
      const data = await fetchAdminClients(page);
      const clientList =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.clients)
          ? data.clients
          : [];

      if (!Array.isArray(clientList)) {
        console.error("Unexpected client data:", data);
        setClients([]);
      } else {
        setClients(clientList);
      }
    } catch (error) {
      console.error("fetchClients full error object:", error);
      console.error("error.response:", error?.response);
      console.error("error.message:", error?.message);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.statusText ||
        error?.message ||
        "Failed to load clients";
      console.error("Final error message to show:", errorMessage);
      throw error;
    }
  };

  const fetchAdvocates = async () => {
    const data = await fetchAdminAdvocates();
    setAdvocates(data);
  };

  const fetchCases = async () => {
    const data = await fetchAdminCases();
    setCases(data);
  };

  const fetchClosedCases = async () => {
    const data = await fetchAdminClosedCases();
    setClosedCases(data);
  };

  const fetchStats = async () => {
    const data = await fetchAdminStats();
    setStats(data);
  };

  const fetchPendingCases = async () => {
    const data = await fetchAdminPendingCases();
    setPendingCases(data);
  };

  const fetchPendingAdvocates = async () => {
    const data = await fetchPendingAdminAdvocates();
    setPendingAdvocates(data);
  };

  const fetchClosureRequests = async () => {
    const data = await fetchAdminClosureRequests();
    setClosureRequests(data);
  };

  const fetchAnalytics = async () => {
    const data = await fetchAdminAnalytics();
    setAnalyticsData(data);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const requests = [
        { label: "clients", run: () => fetchClients() },
        { label: "advocates", run: () => fetchAdvocates() },
        { label: "cases", run: () => fetchCases() },
        { label: "closedCases", run: () => fetchClosedCases() },
        { label: "stats", run: () => fetchStats() },
        { label: "pendingCases", run: () => fetchPendingCases() },
        { label: "pendingAdvocates", run: () => fetchPendingAdvocates() },
        { label: "closureRequests", run: () => fetchClosureRequests() },
        { label: "analytics", run: () => fetchAnalytics() },
      ];

      const results = await Promise.allSettled(
        requests.map((request) => request.run())
      );

      const failedRequests = results
        .map((result, index) => ({ result, label: requests[index].label }))
        .filter(({ result }) => result.status === "rejected");

      if (failedRequests.length === requests.length) {
        failedRequests.forEach(({ label, result }) => {
          console.error(`Admin dashboard request failed: ${label}`, result.reason);
        });
        toast.error("Failed to load admin dashboard");
        return;
      }

      failedRequests.forEach(({ label, result }) => {
        console.error(`Admin dashboard request failed: ${label}`, result.reason);
      });
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (view === "clients") {
      fetchClients().catch((error) => {
        console.error("Error refreshing clients full obj:", error);
        console.error("error.response:", error?.response);
        console.error("error.response?.status:", error?.response?.status);
        console.error("error.response?.data:", error?.response?.data);
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.statusText ||
          error?.message ||
          "Failed to load clients";
        console.error("Toast message to display:", errorMessage);
        toast.error(errorMessage);
      });
    }
  }, [view]);


  const handleFetchClientCases = async (client) => {
    try {
      const data = await fetchAdminClientCases(client.user_id);
      setSelectedClient(client);
      setClientCases(data);
      setSelectedCase(null);
      setCaseTimeline([]);
      setView("clientCases");
    } catch (error) {
      console.error("Error fetching client cases:", error);
      toast.error("Failed to fetch client cases");
    }
  };

      const handleReviveClient = async (clientId) => {
  try {
    await fetch(`/api/admin/revive-client/${clientId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    toast.success("Client account revived");
    await fetchClosureRequests();

  } catch (error) {
    console.error(error);
    toast.error("Failed to revive account");
  }
  };

  const handleAssignAdvocate = async (caseId, advocateId) => {
    if (!advocateId || advocateId === "Select Advocate") {
      return;
    }

    try {
      await assignAdminAdvocate(caseId, advocateId);
      toast.success("Advocate Assigned");
      await fetchCases();
    } catch (error) {
      console.error("Error assigning advocate:", error);
      toast.error("Failed to assign advocate");
    }
  };

  const handleReassignAdvocate = async (caseId, advocateId) => {
    if (!advocateId || advocateId === "Reassign Advocate") {
      return;
    }

    try {
      await reassignAdminAdvocate(caseId, advocateId);
      toast.success("Advocate reassigned successfully");
      await fetchCases();
    } catch (error) {
      console.error("Error reassigning advocate:", error);
      toast.error("Failed to reassign advocate");
    }
  };

  const handleCloseCase = async (caseId) => {
    try {
      await closeAdminCase(caseId);
      toast.success("Case closed successfully");
      await Promise.all([fetchCases(), fetchClosedCases(), fetchStats(), fetchAnalytics()]);
    } catch (error) {
      console.error("Error closing case:", error);
      toast.error("Failed to close case");
    }
  };

  const handleReopenCase = async (caseId) => {
    try {
      await reopenAdminCase(caseId);
      toast.success("Case reopened successfully");
      await Promise.all([fetchCases(), fetchClosedCases(), fetchStats(), fetchAnalytics()]);
    } catch (error) {
      console.error("Error reopening case:", error);
      toast.error("Failed to reopen case");
    }
  };

  const handleApproveCaseReview = async (caseId) => {
    try {
      await approveAdminCase(caseId);
      toast.success("Case Approved");
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#16a34a", "#ca8a04"],
      });
      await Promise.all([fetchPendingCases(), fetchAnalytics(), fetchStats(), fetchCases()]);
    } catch (error) {
      console.error("Error approving case:", error);
      toast.error("Failed to approve case");
    }
  };

  const handleRejectCaseReview = async (caseId) => {
    try {
      await rejectAdminCase(caseId);
      toast.success("Case Rejected");
      await Promise.all([fetchPendingCases(), fetchStats(), fetchCases(), fetchAnalytics()]);
    } catch (error) {
      console.error("Error rejecting case:", error);
      toast.error("Failed to reject case");
    }
  };

  const handleFetchCaseTimeline = async (caseId) => {
    try {
      const data = await fetchAdminCaseTimeline(caseId);
      setCaseTimeline(data);
      setSelectedCase(caseId);
    } catch (error) {
      console.error("Error fetching case timeline:", error);
      toast.error("Failed to fetch case timeline");
    }
  };

  const handleDeleteAdvocate = async (advocateId) => {
    try {
      await deleteAdminAdvocate(advocateId);
      toast.success("Advocate deactivated successfully");
      await Promise.all([fetchAdvocates(), fetchStats()]);
    } catch (error) {
      console.error("Error deleting advocate:", error);
      toast.error(error.response?.data?.message || "Failed to deactivate advocate");
    }
  };

  const handleRestoreAdvocate = async (advocateId) => {
    try {
      await restoreAdminAdvocate(advocateId);
      toast.success("Advocate restored successfully");
      await Promise.all([fetchAdvocates(), fetchStats()]);
    } catch (error) {
      console.error("Error restoring advocate:", error);
      toast.error(error.response?.data?.message || "Failed to restore advocate");
    }
  };

  const handleApprovePendingAdvocate = async (id) => {
    try {
      await approvePendingAdminAdvocate(id);
      toast.success("Advocate approved");
      await Promise.all([fetchPendingAdvocates(), fetchAdvocates(), fetchStats()]);
    } catch (error) {
      console.error("Error approving advocate registration:", error);
      toast.error(error.response?.data?.message || "Failed to approve advocate");
    }
  };

  const handleRejectPendingAdvocate = async (id) => {
    try {
      await rejectPendingAdminAdvocate(id);
      toast.success("Advocate rejected");
      await fetchPendingAdvocates();
    } catch (error) {
      console.error("Error rejecting advocate registration:", error);
      toast.error(error.response?.data?.message || "Failed to reject advocate");
    }
  };

  const handleApproveClientClosure = async (clientId) => {
    try {
      await approveAdminClientClosure(clientId);
      toast.success("Client closure approved");
      await fetchClosureRequests();
    } catch (error) {
      console.error("Error approving client closure:", error);
      toast.error("Failed to approve client closure");
    }
  };

  const handleRejectClientClosure = async (clientId) => {
    try {
      await rejectAdminClientClosure(clientId);
      toast.success("Client closure rejected");
      await fetchClosureRequests();
    } catch (error) {
      console.error("Error rejecting client closure:", error);
      toast.error("Failed to reject client closure");
    }
  };

  const handleApproveAdvocateClosure = async (advocateId) => {
    try {
      await approveAdminAdvocateClosure(advocateId);
      toast.success("Advocate closure approved");
      await Promise.all([fetchClosureRequests(), fetchAdvocates()]);
    } catch (error) {
      console.error("Error approving advocate closure:", error);
      toast.error("Failed to approve advocate closure");
    }
  };

  const handleRejectAdvocateClosure = async (advocateId) => {
    try {
      await rejectAdminAdvocateClosure(advocateId);
      toast.success("Advocate closure rejected");
      await fetchClosureRequests();
    } catch (error) {
      console.error("Error rejecting advocate closure:", error);
      toast.error("Failed to reject advocate closure");
    }
  };

  return (
    <div className="client-dashboard-new">
      <h1>Admin Dashboard</h1>

      {view === "dashboard" && (
        <AdminOverview
          analyticsData={analyticsData}
          onNavigate={setView}
          stats={stats}
        />
      )}

      {view === "clients" && (
        <ClientsView
          clients={clients}
          onBack={() => setView("dashboard")}
          onSelectClient={handleFetchClientCases}
        />
      )}

      {view === "clientCases" && (
        <ClientCasesView
          caseTimeline={caseTimeline}
          clientCases={clientCases}
          onBack={() => setView("clients")}
          onCloseTimeline={() => setSelectedCase(null)}
          onFetchTimeline={handleFetchCaseTimeline}
          selectedCase={selectedCase}
          selectedClient={selectedClient}
        />
      )}

      {view === "advocates" && (
        <AdvocatesView
          advocates={advocates}
          onBack={() => setView("dashboard")}
          onDeleteAdvocate={handleDeleteAdvocate}
          onRestoreAdvocate={handleRestoreAdvocate}
        />
      )}

      {view === "cases" && (
        <CaseAssignmentView
          advocates={advocates}
          caseSearch={caseSearch}
          cases={cases}
          onAssignAdvocate={handleAssignAdvocate}
          onBack={() => setView("dashboard")}
          onCaseSearchChange={setCaseSearch}
          onCloseCase={handleCloseCase}
          onReassignAdvocate={handleReassignAdvocate}
          onReopenCase={handleReopenCase}
          onStatusFilterChange={setStatusFilter}
          statusFilter={statusFilter}
        />
      )}

      {view === "closedCases" && (
        <ClosedCasesView
          closedCases={closedCases}
          onBack={() => setView("dashboard")}
        />
      )}

      {view === "review" && (
        <CaseReviewView
          onApprove={handleApproveCaseReview}
          onBack={() => setView("dashboard")}
          onReject={handleRejectCaseReview}
          pendingCases={pendingCases}
        />
      )}

      {view === "analytics" && analyticsData && (
        <AnalyticsView
          analyticsData={analyticsData}
          onBack={() => setView("dashboard")}
          stats={stats}
        />
      )}

      {view === "pendingAdvocates" && (
        <PendingAdvocatesView
          advocates={pendingAdvocates}
          onApprove={handleApprovePendingAdvocate}
          onBack={() => setView("dashboard")}
          onReject={handleRejectPendingAdvocate}
        />
      )}

      {view === "closures" && (
    <ClosureRequestsView
    advocateClosures={closureRequests.advocates}
    clientClosures={closureRequests.clients}
    closedClients={closureRequests.closedClients} // 👈 ADD
    onApproveAdvocate={handleApproveAdvocateClosure}
    onApproveClient={handleApproveClientClosure}
    onRejectAdvocate={handleRejectAdvocateClosure}
    onRejectClient={handleRejectClientClosure}
    onReviveClient={handleReviveClient} // 👈 ADD
    onBack={() => setView("dashboard")}
  />
)}
    </div>
  );
}

export default AdminDashboard;
