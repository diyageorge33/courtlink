import Sidebar from "../../components/ClientSidebar";

function CaseTypeGuide() {
  return (
    <div className="client-layout">
      <Sidebar />

      <main className="case-guide-container">
        <div className="case-guide-inner">
          <h1 className="case-guide-title">Identify Your Case Type</h1>

          <div className="case-guide-card">
            <h3>🔴 Criminal</h3>
            <p>
              Theft, assault, fraud, cybercrime, domestic violence, FIR matters,
              cheque bounce (Section 138 NI Act), police complaints and offences under IPC.
            </p>
          </div>

          <div className="case-guide-card">
            <h3>🔵 Civil</h3>
            <p>
              Property disputes, land ownership, partition suits, contract disputes,
              money recovery, landlord-tenant issues, injunctions and agreement disputes.
            </p>
          </div>

          <div className="case-guide-card">
            <h3>🟣 Family</h3>
            <p>
              Divorce, maintenance, child custody, guardianship, adoption,
              matrimonial disputes and family court matters.
            </p>
          </div>

          <div className="case-guide-card">
            <h3>🟢 Consumer</h3>
            <p>
              Defective products, service deficiency, refund disputes,
              insurance claim rejection, builder delay complaints and online purchase issues.
            </p>
          </div>

          <div className="case-guide-card">
            <h3>🟡 Labour</h3>
            <p>
              Wrongful termination, unpaid salary, workplace harassment,
              industrial disputes and employment-related issues.
            </p>
          </div>

          <div className="case-guide-card">
            <h3>🟠 Corporate / Commercial</h3>
            <p>
              Business disputes, shareholder issues, company mismanagement,
              partnership disputes, contract breaches and NCLT matters.
            </p>
          </div>

          <div className="case-guide-card">
            <h3>🟤 Taxation</h3>
            <p>
              Income tax disputes, GST notices, penalty appeals,
              tax recovery proceedings and assessment challenges.
            </p>
          </div>

          <div className="case-guide-card">
            <h3>🟢 Constitutional / Writ</h3>
            <p>
              Fundamental rights violations, government action challenges,
              writ petitions filed in High Court or Supreme Court.
            </p>
          </div>

          <div className="case-guide-card">
            <h3>🔷 Cyber Law</h3>
            <p>
              Online fraud, identity theft, hacking, digital harassment,
              social media crimes and data privacy issues.
            </p>
          </div>

          <div className="case-guide-card">
            <h3>🟣 Intellectual Property</h3>
            <p>
              Trademark disputes, copyright infringement,
              patent protection issues and brand misuse cases.
            </p>
          </div>

          <div className="case-guide-card">
            <h3>🟢 Environmental</h3>
            <p>
              Pollution complaints, environmental damage claims,
              industrial violations and ecological protection matters.
            </p>
          </div>

          <div className="case-guide-card">
            <h3>⚖ Arbitration & Mediation</h3>
            <p>
              Alternative dispute resolution cases settled outside court
              through arbitration agreements or mediation proceedings.
            </p>
          </div>


        </div>
      </main>
    </div>
  );
}

export default CaseTypeGuide;