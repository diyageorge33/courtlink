import { toast } from "react-toastify";

function PayConsultation({ caseId }) {

  const loadRazorpay = async () => {
    console.log("Initiating payment for caseId:", caseId);
    const res = await fetch("http://localhost:5000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caseId }),
    });

    const order = await res.json();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "CourtLink",
      description: "Advocate Consultation Fee",
      order_id: order.id,
      handler: async (response) => {
        const verify = await fetch(
          "http://localhost:5000/api/payment/verify-payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              caseId,
            }),
          }
        );

        if (verify.ok) {
          toast.success("Payment successful. Features unlocked!");
          window.location.reload();
        } else {
          toast.error("Payment verification failed");
        }
      },
      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button className="btn-primary" onClick={loadRazorpay}>
      Pay Consultation Fee ₹500
    </button>
  );
}

export default PayConsultation;
