import { useEffect, useState } from "react";

function PaymentHistory() {

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/payment/history", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setPayments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching payments:", err);
        setLoading(false);
      });

  }, []);

  return (

    <div className="client-dashboard-new">

      <h1 className="page-title-new">Payment History</h1>

      <p className="ai-tagline-new">
        View your consultation payment details.
      </p>

      {loading ? (
        <p>Loading payments...</p>
      ) : payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (

        <div style={{ marginTop: "30px" }}>

          {payments.map((payment, index) => (

            <div className="payment-card-new" key={index}>

              <div className="payment-header-new">
                <span className="payment-status-new">
                  {payment.consultation_paid ? "PAID" : "PENDING"}
                </span>
              </div>

              <p><strong>Transaction ID:</strong></p>
              <p className="payment-id-new">{payment.transaction_id}</p>

              <p><strong>Amount:</strong> ₹500</p>

              <p>
                <strong>Date:</strong>{" "}
                {payment.paid_at
                  ? new Date(payment.paid_at).toLocaleString()
                  : "—"}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}

export default PaymentHistory;