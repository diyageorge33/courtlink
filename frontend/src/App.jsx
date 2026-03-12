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
import Aiassistant from "./pages/client/Aiassistant";
import Aisummarizer from "./pages/client/Aisummarizer";
import AdvocateDashboard from "./pages/advocate/AdvocateDashboard";
import ScrollToTop from "./components/ScrollToTop";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import VerifyOtp from "./pages/VerifyOtp";
import Bookappointment from "./pages/Bookappointment";
import Clientsetting from "./pages/client/Clientsetting";
import Paymentshistory from "./pages/Paymentshistory";
import Document from "./pages/Document";
import Mycase from "./pages/Mycase";
import PaymentTest from "./pages/PaymentTest";
import ProtectedRoute from "./components/ProtectedRoute";
import FileCase from "./pages/FileCase";
import UploadDocuments from "./pages/UploadDocuments";
import PaymentHistory from "./pages/client/PaymentHistory"; 
import CaseTypeGuide from "./pages/client/CaseTypeGuide";


import AddCase from "./pages/advocate/AddCase";
import AdvocateCases from "./pages/advocate/AdvocateCases";
import ScheduleHearing from "./pages/advocate/ScheduleHearing";
import UploadOrder from "./pages/advocate/UploadOrder";
import Clients from "./pages/advocate/Clients";
import CaseDetails from "./pages/advocate/CaseDetails";

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
            <Route path="/Bookappointment" element={<Bookappointment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/register/advocate" element={<AdvocateRegister />} />
            {/* <Route path="/dashboard/client" element={<ClientDashboard />} /> */}
            <Route path="/dashboard/client" element={<ProtectedRoute>  <ClientDashboard /> </ProtectedRoute>} />
            <Route path="/dashboard/client/aiassistant" element={<ProtectedRoute><Aiassistant /></ProtectedRoute>} />
            <Route path="/dashboard/client/aisummarizer" element={<ProtectedRoute><Aisummarizer /></ProtectedRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            

            

            <Route path="/clientsetting" element={<Clientsetting />} />
            <Route path="/paymentshistory" element={<Paymentshistory />} />
            <Route path="/dashboard/client/document" element={<Document />} />
            <Route path="/mycase" element={<Mycase />} />
            <Route path="/dashboard/client/filecase" element={<FileCase />} />
            <Route path="/dashboard/client/uploaddocuments" element={<UploadDocuments />} />

            {/* <Route path="/clientsetting" element={<Clientsetting />} /> */}
            {/* <Route path="/paymentshistory" element={<Paymentshistory />} /> */}
            <Route path="/dashboard/client/document" element={<ProtectedRoute><Document /></ProtectedRoute>} />
            <Route path="/mycase" element={<ProtectedRoute><Mycase /></ProtectedRoute>} />
            <Route path="/dashboard/client/case-type-guide" element={<CaseTypeGuide />} />
            <Route path="/payment-test" element={<ProtectedRoute><PaymentTest /></ProtectedRoute>} />
            <Route path="/dashboard/client/filecase" element={<ProtectedRoute><FileCase /></ProtectedRoute>} />
            <Route path="/dashboard/client/paymenthistory" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
            <Route path="/dashboard/client/uploaddocuments" element={<ProtectedRoute><UploadDocuments /></ProtectedRoute>} />
            <Route path="/dashboard/client/clientsetting" element={<ProtectedRoute><Clientsetting /></ProtectedRoute>} />

            <Route  path="/dashboard/advocate"  element={<ProtectedRoute><AdvocateDashboard /></ProtectedRoute>}>
            <Route path="cases" element={<AdvocateCases />} /></Route>
            <Route path="/dashboard/advocate/addcase" element={<AddCase />} />
            <Route path="/dashboard/advocate/hearings" element={<ScheduleHearing />}/>
            <Route path="/dashboard/advocate/uploadorder" element={<UploadOrder />} />
            <Route path="/dashboard/advocate/clients" element={<Clients />} />
            <Route path="/dashboard/advocate/case/:id" element={<CaseDetails />} />


          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
