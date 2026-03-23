function Faq() {
  return (
    <div className="info-page">
      <div className="info-container">
        <h1>Frequently Asked Questions (FAQs)</h1>

        <p className="about-intro">
          Here are some common questions about using CourtLink. This platform helps
          clients manage cases, communicate with advocates, and track legal progress easily.
        </p>

        <div className="info-content">

          <p><b>1. What is CourtLink?</b><br />
            CourtLink is a web-based platform that allows clients to file cases,
            track case progress, upload documents, and interact with assigned advocates
            in one place.
          </p>

          <p><b>2. How do I create an account?</b><br />
            You can register by signing up with your email and password. An OTP will
            be sent to your email for verification before activating your account.
          </p>

          <p><b>3. How can I file a new case?</b><br />
            After logging in, go to your dashboard and use the "File Case" option.
            Provide the case title, type, and description to submit your request.
          </p>

          <p><b>4. Can I track the status of my case?</b><br />
            Yes. You can view all your cases along with their status (Pending, Ongoing,
            Closed, etc.) directly from your dashboard.
          </p>

          <p><b>5. How are advocates assigned?</b><br />
            Advocates are assigned by the admin based on your case type and requirements.
            Once assigned, their details will be visible in your dashboard.
          </p>

          <p><b>6. Can I request to change my advocate?</b><br />
            Yes. You can request a change of advocate from your case section. You can
            also cancel the request if needed.
          </p>

          <p><b>7. Can I upload documents for my case?</b><br />
            Yes. You can upload documents related to your case such as evidence,
            agreements, or notices. These will be linked to your case securely.
          </p>

          <p><b>8. Who can access my case details?</b><br />
            Only you, the assigned advocate, and authorized admins can access your
            case information.
          </p>

          <p><b>9. Will I receive updates about my case?</b><br />
            Yes. You will receive notifications for important updates like document uploads,
            upcoming hearings, and case progress.
          </p>

          <p><b>10. How do I update my profile details?</b><br />
            You can update your personal details such as name, phone, address,
            and date of birth from the Settings page.
          </p>

          <p><b>11. What happens if I request account closure?</b><br />
            Your account will be marked as "Pending Closure". You can cancel the
            request before it is finalized.
          </p>

          <p><b>12. Is my data secure?</b><br />
            Yes. CourtLink uses authentication and access control to ensure that
            your personal and case-related data remains secure.
          </p>

        </div>

        <p style={{ marginTop: "30px", fontWeight: "600" }}>
          ⚖️ CourtLink aims to make legal case management simple, transparent,
          and accessible for every client.
        </p>
      </div>
    </div>
  );
}

export default Faq;