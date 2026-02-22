import { useEffect, useState } from "react";
import Sidebar from "../../components/ClientSidebar";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clientId = localStorage.getItem("userId");

    if (!clientId) return;

    fetch(`http://localhost:5000/api/payment/history/${clientId}`)
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
    <div className="client-layout">
      <Sidebar />

      <main className="client-content">
        <h1>Payment History</h1>
        <p className="dashboard-subtitle">
          View your consultation payment details.
        </p>

        {loading ? (
          <p>Loading payments...</p>
        ) : payments.length === 0 ? (
          <div className="action-card">
            <p>No payments found.</p>
          </div>
        ) : (
          <div className="payments-grid">
            {payments.map((payment, index) => (
              <div className="payment-card" key={index}>
                <div className="payment-header">
                  <span className="payment-status">
                    {payment.consultation_paid ? "PAID" : "PENDING"}
                  </span>
                </div>

                <p><strong>Transaction ID:</strong></p>
                <p className="payment-id">{payment.transaction_id}</p>

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
      </main>
    </div>
  );
}

export default PaymentHistory;