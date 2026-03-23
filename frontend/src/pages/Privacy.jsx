function Privacy() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>Privacy Policy</h1>

        <p className="about-intro">
          CourtLink is committed to protecting your personal information and ensuring
          a safe experience while using the platform. This policy explains how your
          data is collected and used.
        </p>

        <div className="about-section">
          <h2>Information We Collect</h2>
          <p>
            We collect details such as your name, email address, phone number, and
            date of birth during registration. Additional information such as case
            details and uploaded documents is also stored as part of platform usage.
          </p>
        </div>

        <div className="about-section">
          <h2>How We Use Your Information</h2>
          <p>
            Your information is used to create and manage your account, process case
            requests, assign advocates, and provide updates related to your cases.
          </p>
        </div>

        <div className="about-section">
          <h2>Data Access</h2>
          <p>
            Your data is accessible only to you, the assigned advocate, and authorized
            administrators within the system.
          </p>
        </div>

        <div className="about-section">
          <h2>Document Handling</h2>
          <p>
            Documents uploaded to CourtLink are stored in the system and linked to
            your case. Access is restricted to authorized users.
          </p>
        </div>

        <div className="about-section">
          <h2>Data Security</h2>
          <p>
            CourtLink uses authentication mechanisms and controlled access to protect
            user data. However, users are advised to keep their login credentials secure.
          </p>
        </div>

        <div className="about-section">
          <h2>Your Control</h2>
          <p>
            You can update your personal information through the Settings page and
            request account closure if needed.
          </p>
        </div>

        <div className="about-section">
          <h2>Policy Updates</h2>
          <p>
            This policy may be updated periodically. Continued use of CourtLink
            indicates acceptance of any changes.
          </p>
        </div>

        <p style={{ marginTop: "25px", fontWeight: "600" }}>
          ⚖️ CourtLink aims to handle your data responsibly and maintain user trust.
        </p>
      </div>
    </div>
  );
}

export default Privacy;
