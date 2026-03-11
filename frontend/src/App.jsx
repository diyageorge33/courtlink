import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
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

import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";

import FileCase from "./pages/FileCase";
import UploadDocuments from "./pages/UploadDocuments";
import PaymentHistory from "./pages/client/PaymentHistory";
import CaseTypeGuide from "./pages/client/CaseTypeGuide";
import Clientsetting from "./pages/client/Clientsetting";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <BrowserRouter>
        <ScrollToTop />

        <div className="app-container">

          <Navbar />

          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/Legalexperts" element={<Legalexperts />} />
            <Route path="/help" element={<Help />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/track-case" element={<TrackCase />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/Practice" element={<Practice />} />
            <Route path="/Bookappointment" element={<Practice />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            <Route path="/register/advocate" element={<AdvocateRegister />} />

            {/* CLIENT DASHBOARD */}

            <Route
              path="/dashboard/client"
              element={
                <ProtectedRoute roleRequired="CLIENT">
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/client/aiassistant"
              element={
                <ProtectedRoute roleRequired="CLIENT">
                  <Aiassistant />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/client/aisummarizer"
              element={
                <ProtectedRoute roleRequired="CLIENT">
                  <Aisummarizer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/client/filecase"
              element={
                <ProtectedRoute roleRequired="CLIENT">
                  <FileCase />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/client/uploaddocuments"
              element={
                <ProtectedRoute roleRequired="CLIENT">
                  <UploadDocuments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/client/paymenthistory"
              element={
                <ProtectedRoute roleRequired="CLIENT">
                  <PaymentHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/client/clientsetting"
              element={
                <ProtectedRoute roleRequired="CLIENT">
                  <Clientsetting />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/client/case-type-guide"
              element={<CaseTypeGuide />}
            />

            {/* ADVOCATE */}

            <Route
              path="/dashboard/advocate"
              element={
                <ProtectedRoute roleRequired="ADVOCATE">
                  <AdvocateDashboard />
                </ProtectedRoute>
              }
            />

            {/* ADMIN */}

            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute roleRequired="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* AUTH */}

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

          </Routes>

        </div>

      </BrowserRouter>
    </>
  );
}

export default App;