import PayConsultation from "../pages/PayConsultation";

function PaymentTest() {
  return (
    <div style={{ padding: "40px" }}>
      <h2>Payment Test Page</h2>
      <PayConsultation caseId={1} />
    </div>
  );
}

export default PaymentTest;
