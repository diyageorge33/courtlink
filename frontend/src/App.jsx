import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Legalexperts from "./pages/Legalexperts";
import Help from "./pages/Help";
import Faq from "./pages/faq";
import Contact from "./pages/Contact";
import TrackCase from "./pages/TrackCase";
import Orders from "./pages/Orders";
import Practice from "./pages/Practice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AdvocateRegister from "./pages/AdvocateRegister";

import ClientDashboard from "./pages/client/ClientDashboard";
import AdvocateDashboard from "./pages/advocate/AdvocateDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import Aiassistant from "./pages/client/Aiassistant";
import Aisummarizer from "./pages/client/Aisummarizer";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";

import Bookappointment from "./pages/Bookappointment";
import Document from "./pages/Document";
import Mycase from "./pages/Mycase";

import FileCase from "./pages/FileCase";
import UploadDocuments from "./pages/UploadDocuments";
import ClientNotifications from "./pages/client/ClientNotifications";
import PaymentHistory from "./pages/client/PaymentHistory";
import CaseTypeGuide from "./pages/client/CaseTypeGuide";
import Clientsetting from "./pages/client/Clientsetting";
import ClientOngoingCases from "./pages/client/ClientOngoingCases";
import ClientClosedCases from "./pages/client/ClientClosedCases";
import ClientHearings from "./pages/client/ClientHearings";
import ClientAdvocates from "./pages/client/ClientAdvocates";
import Casetypepage from "./pages/Casetypepage";
import ClientOrders from "./pages/client/ClientOrders";
import AddCase from "./pages/advocate/AddCase";
import AdvocateCases from "./pages/advocate/AdvocateCases";
import ScheduleHearing from "./pages/advocate/ScheduleHearing";
import UploadOrder from "./pages/advocate/UploadOrder";
import Clients from "./pages/advocate/Clients";
import CaseDetails from "./pages/advocate/CaseDetails";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Toaster position="top-right" />
      <BrowserRouter>
        <ScrollToTop />

        <div className="app-container">
          <Navbar />
        
          <Routes>

            {/* PUBLIC PAGES */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/legalexperts" element={<Legalexperts />} />
            <Route path="/help" element={<Help />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/track-case" element={<TrackCase />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/bookappointment" element={<Bookappointment />} />
            <Route path="/case-type" element={<Casetypepage />} />

            {/* AUTH */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/advocate" element={<AdvocateRegister />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            {/* LEGAL PAGES */}
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* CLIENT DASHBOARD */}
            <Route path="/dashboard/client" element={<ProtectedRoute roleRequired="CLIENT"><ClientDashboard /></ProtectedRoute>}  />
            <Route
            path="/dashboard/client/ongoing"
            element={
            <ProtectedRoute roleRequired="CLIENT">
            <ClientOngoingCases />
            </ProtectedRoute>
          }
          />

          <Route
          path="/dashboard/client/closed"
          element={
          <ProtectedRoute roleRequired="CLIENT">
          <ClientClosedCases />
          </ProtectedRoute>
            }
          />

            <Route
            path="/dashboard/client/orders"
            element={
            <ProtectedRoute roleRequired="CLIENT">
            <ClientOrders />
            </ProtectedRoute>
            }
            />

          <Route
          path="/dashboard/client/hearings"
          element={
          <ProtectedRoute roleRequired="CLIENT">
            <ClientHearings />
          </ProtectedRoute>
          }
          />

              <Route
          path="/dashboard/client/advocates"
          element={
          <ProtectedRoute roleRequired="CLIENT">
          <ClientAdvocates />
          </ProtectedRoute>
        }
        />

          <Route
          path="/dashboard/client/notifications"
          element={
          <ProtectedRoute roleRequired="CLIENT">
          <ClientNotifications />
          </ProtectedRoute>
          }
          />

            <Route
              path="/dashboard/client/aiassistant"
              element={<ProtectedRoute roleRequired="CLIENT"><Aiassistant /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/client/aisummarizer"
              element={<ProtectedRoute roleRequired="CLIENT"><Aisummarizer /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/client/filecase"
              element={<ProtectedRoute roleRequired="CLIENT"><FileCase /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/client/uploaddocuments"
              element={<ProtectedRoute roleRequired="CLIENT"><UploadDocuments /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/client/paymenthistory"
              element={<ProtectedRoute roleRequired="CLIENT"><PaymentHistory /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/client/clientsetting"
              element={<ProtectedRoute roleRequired="CLIENT"><Clientsetting /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/client/document"
              element={<ProtectedRoute roleRequired="CLIENT"><Document /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/client/case-type-guide"
              element={<ProtectedRoute roleRequired="CLIENT"><CaseTypeGuide /></ProtectedRoute>}
            />
            <Route
              path="/mycase"
              element={<ProtectedRoute roleRequired="CLIENT"><Mycase /></ProtectedRoute>}
            />

            {/* ADVOCATE DASHBOARD */}
            <Route
              path="/dashboard/advocate"
              element={<ProtectedRoute roleRequired="ADVOCATE"><AdvocateDashboard /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/advocate/cases"
              element={<ProtectedRoute roleRequired="ADVOCATE"><AdvocateCases /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/advocate/addcase"
              element={<ProtectedRoute roleRequired="ADVOCATE"><AddCase /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/advocate/hearings"
              element={<ProtectedRoute roleRequired="ADVOCATE"><ScheduleHearing /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/advocate/uploadorder"
              element={<ProtectedRoute roleRequired="ADVOCATE"><UploadOrder /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/advocate/clients"
              element={<ProtectedRoute roleRequired="ADVOCATE"><Clients /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/advocate/case/:id"
              element={<ProtectedRoute roleRequired="ADVOCATE"><CaseDetails /></ProtectedRoute>}
            />

            {/* ADMIN DASHBOARD */}
            <Route
              path="/dashboard/admin"
              element={<ProtectedRoute roleRequired="ADMIN"><AdminDashboard /></ProtectedRoute>}
            />

          </Routes>
        </div>

      </BrowserRouter>
    </>
  );
}

export default App;