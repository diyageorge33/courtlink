function Help() {
  return (
    <div className="info-page">
      <div className="info-container">
        <h1>HELP CENTER</h1>

        <p>
          Welcome to the Help Center of CourtLink.
          <br />
          This page will guide you on how to use our platform smoothly and effectively.
        </p>

        <p>
          CourtLink is designed for our law firm to provide clients and advocates
          with a transparent and efficient way to manage legal services.
        </p>

        <p><b>1. Creating an Account</b><br />
          To create an account, go to the Sign Up page and enter your details such as
          name, email, phone number, and password. Once registered, you can log in
          and access the client dashboard.
        </p>

        <p><b>2. Logging In</b><br />
          Use your registered email and password to log in. After logging in, you will
          be redirected to the appropriate dashboard based on your role (Client or Advocate).
        </p>

        <p><b>3. Filing a Case Request</b><br />
          Clients can submit a new case request through the dashboard by selecting the
          appropriate Practice Area and providing a short description of the issue.
        </p>

        <p><b>4. Uploading Documents</b><br />
          Clients can upload important documents such as ID proof, evidence files, agreements,
          and notices through the Documents section in the dashboard.
        </p>

        <p><b>5. Tracking Case Status</b><br />
          Once a case is submitted, clients can track the case status and progress updates
          through the Case Status section. Updates will be provided by advocates and administrators.
        </p>

        <p><b>6. Downloading Court Orders</b><br />
          Court orders and judgement documents uploaded by the advocate or admin can be downloaded
          anytime from the Orders section in your dashboard.
        </p>

        <p><b>7. Forgot Password Support</b><br />
          If you forget your password, click on "Forgot Password" on the login page. You will receive
          an OTP via email to reset your password securely.
        </p>

        <p><b>8. Contacting the Law Firm</b><br />
          If you need further assistance, you can contact our law firm through the Contact Us page.
          Our team will respond to your queries as soon as possible during working hours.
        </p>

        <p style={{ marginTop: "25px", fontWeight: "600" }}>
          ⚖️ CourtLink is committed to providing secure and professional legal support to every client.
        </p>
      </div>
    </div>
  );
}

export default Help;
