import { useNavigate } from "react-router-dom";

function Hero() {
const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-text">
          <h1>Justice, Simplified</h1>

          <p>
            CourtLink streamlines legal processes, offering secure case filing,
            status tracking, and document management for citizens, advocates,
            and administrators.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => navigate("/login")}
            >
                Login to CourtLink
            </button>


            <button className="btn-outline"
            onClick={() => navigate("/track-case")}
            >
              Check Case Status
              {/* BACKEND: GET /api/cases/:caseId */}
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="/courtlink.png"
            alt="CourtLink illustration"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
