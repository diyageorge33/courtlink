function Faq() {
  return (
    <div className="info-page">
      <div className="info-container">
        <h1>Frequently Asked Questions (FAQs)</h1>

        <p className="about-intro">
          Here are some common questions clients and users ask about CourtLink.
          If you need further assistance, please contact our law firm directly.
        </p>

        <div className=".info-page p">
          <p><b>1. What is CourtLink?</b><br />          
            CourtLink is a digital platform developed for our law firm to provide
            easy access to legal services, case updates, and client support.
          </p>

          <p><b>2. How can I register as a client?</b><br />
            You can register as a client by clicking on the Sign Up option and
            filling in your basic details such as name, email, and password.
          </p>

          <p><b>3. How can I request legal assistance?</b><br />
            Clients can request legal assistance by submitting a case request
            through the dashboard or by contacting our office directly.
          </p>

          <p><b>4. What are Practice Areas?</b><br />
            Practice Areas refer to the different types of legal services handled
            by our firm such as Criminal Law, Civil Law, Family Law, Property Disputes,
            and Corporate Law.
          </p>

          <p><b>5. Can I track my case status online?</b><br />
            Yes. Clients can track the current status and progress of their cases
            through the CourtLink dashboard.
          </p>

          <p><b>6. How do I reset my password if I forget it?</b><br />
            Go to the Login page, click on "Forgot Password", verify your email
            using OTP, and set a new password.
          </p>

          <p><b>7. Is my personal information safe on CourtLink?</b><br />
            Yes. CourtLink uses secure authentication and data protection methods
            to ensure your personal information remains private and secure.
          </p>

          <p><b>8. Can I upload documents related to my case?</b><br />
            Yes. Clients can upload case-related documents such as ID proofs,
            evidence, agreements, and court notices through the dashboard.
          </p>

          <p><b>9. Who can access my case details?</b><br />
            Only the client, assigned advocate, and authorized administrators can
            access case-related information.
          </p>

          <p><b>10. Can I download court orders and legal documents?</b><br />
            Yes. Court orders and legal documents uploaded by the advocate or admin
            can be downloaded anytime from the dashboard.
          </p>

          <p><b>11. Does CourtLink provide free legal consultation?</b><br />
            Consultation charges depend on the nature of the case and the advocate
            assigned. Details will be informed before confirmation.
          </p>

          <p><b>12. How do I contact the law firm for urgent queries?</b><br />
            You can use the Contact Us page to reach the firm via phone or email
            during working hours.
          </p>
        </div>

        <p style={{ marginTop: "30px", fontWeight: "600" }}>
          ⚖️ CourtLink is committed to providing transparency, professionalism,
          and efficient legal support to every client.
        </p>
      </div>
    </div>
  );
}

export default Faq;