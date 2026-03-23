function Terms() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>Terms & Conditions</h1>

        <p className="about-intro">
          By accessing and using CourtLink, you agree to comply with the following
          terms and conditions. These terms govern your use of the platform and its services.
        </p>

        <div className="about-section">
          <h2>User Responsibilities</h2>
          <p>
            Users must provide accurate and complete information during registration.
            You are responsible for maintaining the confidentiality of your login credentials
            and for all activities carried out through your account.
          </p>
        </div>

        <div className="about-section">
          <h2>Case Submission</h2>
          <p>
            Clients are responsible for submitting genuine and lawful case information.
            Any false, misleading, or inappropriate submissions may result in rejection
            or account action.
          </p>
        </div>

        <div className="about-section">
          <h2>Advocate Conduct</h2>
          <p>
            Advocates using the platform must provide professional and ethical legal services.
            Advocate accounts are subject to admin approval before activation.
          </p>
        </div>

        <div className="about-section">
          <h2>Document Uploads</h2>
          <p>
            Users are responsible for the documents they upload. CourtLink is not responsible
            for the accuracy or legality of uploaded content. Unauthorized or harmful content
            is strictly prohibited.
          </p>
        </div>

        <div className="about-section">
          <h2>Platform Usage</h2>
          <p>
            Users must not misuse the platform for illegal activities, unauthorized access,
            or disrupting system functionality. Any misuse may lead to account suspension
            or permanent removal.
          </p>
        </div>

        <div className="about-section">
          <h2>Account Management</h2>
          <p>
            Users can update their profile information through the Settings page.
            Account closure requests can be made, which may be processed after review.
          </p>
        </div>

        <div className="about-section">
          <h2>Service Availability</h2>
          <p>
            While we aim to keep CourtLink available at all times, we do not guarantee
            uninterrupted access. The system may be updated or temporarily unavailable
            due to maintenance.
          </p>
        </div>

        <div className="about-section">
          <h2>Changes to Terms</h2>
          <p>
            CourtLink reserves the right to modify these terms at any time.
            Continued use of the platform implies acceptance of the updated terms.
          </p>
        </div>

        <p style={{ marginTop: "25px", fontWeight: "600" }}>
          ⚖️ By using CourtLink, you agree to use the platform responsibly and in
          accordance with these terms.
        </p>
      </div>
    </div>
  );
}

export default Terms;
