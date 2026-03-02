import { toast } from "react-toastify";
import confetti from "canvas-confetti";

function PayConsultation() {

  const launchConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
  };

  const loadRazorpay = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("User not logged in");
        return;
      }

      // Create Razorpay Order
      const res = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const order = await res.json();

      if (!res.ok) {
        toast.error(order.message || "Failed to create order");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "CourtLink",
        description: "Consultation Fee",
        order_id: order.id,

        handler: async (response) => {
          const verify = await fetch(
            "http://localhost:5000/api/payment/verify-payment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(response),
            }
          );

          const verifyData = await verify.json();

          if (verify.ok) {
            toast.success("🎉 Payment successful! Premium unlocked!");
            launchConfetti();

            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            toast.error(
              verifyData.message || "Payment verification failed"
            );
          }
        },

        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <button className="btn-primary" onClick={loadRazorpay}>
      Pay Consultation Fee ₹500
    </button>
  );
}

export default PayConsultation;