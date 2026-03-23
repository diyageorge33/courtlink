function Help() {
  return (
    <div className="info-page">
      <div className="info-container">
        <h1>Help Center</h1>

        <p>
          Welcome to CourtLink Help Center. This guide will help you understand how to
          use the platform to manage your cases, documents, and account efficiently.
        </p>

        <p>
          CourtLink is designed to simplify legal case management by providing clients
          with a structured dashboard to track progress and communicate through the system.
        </p>

        <p><b>1. Creating an Account</b><br />
          To create an account, go to the registration page and enter your details.
          You will receive an OTP via email for verification before your account is activated.
        </p>

        <p><b>2. Logging In</b><br />
          Use your registered email and password to log in. Based on your role,
          you will be redirected to your respective dashboard.
        </p>

        <p><b>3. Filing a Case</b><br />
          Clients can file a new case from the dashboard by providing case details
          such as title, type, and description.
        </p>

        <p><b>4. Viewing and Managing Cases</b><br />
          All your cases will be listed in your dashboard. You can view their status
          (Pending, Ongoing, Closed, or Withdrawn) and track updates easily.
        </p>

        <p><b>5. Uploading Documents</b><br />
          You can upload important documents related to your case such as evidence,
          agreements, and notices. These documents are securely linked to your case.
        </p>

        <p><b>6. Advocate Assignment</b><br />
          Once your case is reviewed, an advocate will be assigned. You can view
          advocate details in your dashboard.
        </p>

        <p><b>7. Requesting Advocate Change</b><br />
          If needed, you can request a change of advocate for a case. You also have
          the option to cancel the request.
        </p>

        <p><b>8. Notifications and Updates</b><br />
          You will receive updates about your case, such as document uploads and
          upcoming hearings, through the notification system.
        </p>

        <p><b>9. Updating Profile Information</b><br />
          You can update your personal details like name, phone number, address,
          and date of birth from the Settings page.
        </p>

        <p><b>10. Account Closure</b><br />
          You can request account closure from the Settings page. Your account will
          be marked as "Pending Closure", and you can cancel the request if needed.
        </p>

        <p><b>11. Forgot Password</b><br />
          If you forget your password, use the "Forgot Password" option on the login
          page. An OTP will be sent to your email to reset your password.
        </p>

        <p style={{ marginTop: "25px", fontWeight: "600" }}>
          ⚖️ CourtLink aims to provide a simple, transparent, and secure experience
          for managing legal cases.
        </p>
      </div>
    </div>
  );
}

export default Help;
