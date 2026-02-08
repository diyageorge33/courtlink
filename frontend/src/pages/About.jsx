function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About CourtLink</h1>

        <p className="about-intro">
          CourtLink is a digital platform designed to simplify access to judicial
          services for clients, advocates, and administrators.
        </p>

        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to bring transparency, efficiency, and accessibility
            to legal processes through secure and user-friendly technology.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Vision</h2>
          <p>
            We aim to modernize law firm services by making legal case handling
            faster, easier, and more organized for both clients and advocates.
          </p>
        </div>

        <div className="about-section">
          <h2>Why Choose CourtLink?</h2>
          <ul>
            <li>Secure login system for clients, advocates, and admin</li>
            <li>Easy case tracking and updates</li>
            <li>Efficient communication between clients and advocates</li>
            <li>Document upload and order download support</li>
            <li>Simple and user-friendly interface</li>
          </ul>
        </div>

        <div className="about-cards">
          <div className="about-card">
            <h3>Transparency</h3>
            <p>Users can track case progress and updates clearly.</p>
          </div>

          <div className="about-card">
            <h3>Efficiency</h3>
            <p>Reduces delays by organizing case processes digitally.</p>
          </div>

          <div className="about-card">
            <h3>Accessibility</h3>
            <p>Legal support becomes easier to access from anywhere.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
