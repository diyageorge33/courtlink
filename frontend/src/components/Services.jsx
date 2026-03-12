import { useNavigate } from "react-router-dom";

function Services() {
  const navigate = useNavigate();

  return (
    <section className="services">
      <h2>Quick Access Services</h2>

      <div className="services-grid">
        <div
            className="service-card"
            onClick={() => navigate("/track-case")}
        >

          <h3>Track Case Status</h3>
          <p>
            View real-time updates on hearings, orders, and case progress.
          </p>
          {/* BACKEND: GET /api/cases/status */}
        </div>

        <div
            className="service-card"
            onClick={() => navigate("/orders")}
        >

          <h3>Download Orders</h3>
          <p>
            Securely download court orders and judgments anytime.
          </p>
          {/* BACKEND: GET /api/orders */}
        </div>

        <div
  className="service-card"
  onClick={() => navigate("/case-type-page")}
        >
  <h3>Case Types</h3>
  <p>
    You can see what kind of case you are into.
  </p>
</div>
      </div>
    </section>
  );
}

export default Services;
