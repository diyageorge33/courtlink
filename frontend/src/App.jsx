import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Services from "./pages/Services";
import CaseStatus from "./pages/CaseStatus";
import Help from "./pages/Help";
import TrackCase from "./pages/TrackCase";
import Orders from "./pages/Orders";
import Advocate from "./pages/Advocate";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AdvocateRegister from "./pages/AdvocateRegister";
import ClientDashboard from "./pages/client/ClientDashboard";
import AdvocateDashboard from "./pages/advocate/AdvocateDashboard";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import VerifyOtp from "./pages/VerifyOtp";

function App() {
  return (
    <>
      {/* Toast notifications (GLOBAL) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      <BrowserRouter>
        <div className="app-container">
          <Navbar /> 

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/case-status" element={<CaseStatus />} />
            <Route path="/help" element={<Help />} />
            <Route path="/track-case" element={<TrackCase />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/advocate" element={<Advocate />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/register/advocate" element={<AdvocateRegister />} />
            <Route path="/dashboard/client" element={<ClientDashboard />} />
            <Route path="/dashboard/advocate" element={<AdvocateDashboard />} />
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
