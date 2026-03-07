// import { useState } from "react";
// import Sidebar from "../../components/ClientSidebar";

// function Aiassistant() {
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSend = async () => {
//     if (message.trim() === "") return;

//     setChat((prev) => [...prev, { sender: "user", text: message }]);
//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:5000/api/ai/ask", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ question: message }),
//       });

//       const data = await response.json();

//       setChat((prev) => [
//         ...prev,
//         { sender: "bot", text: data.answer || "No response from AI." },
//       ]);
//     } catch (error) {
//       setChat((prev) => [
//         ...prev,
//         { sender: "bot", text: "Backend not responding. Please try again later." },
//       ]);
//     }

//     setMessage("");
//     setLoading(false);
//   };

//   return (
//     <div className="client-layout">
//       <Sidebar />

//       <main className="client-content">
//         <h1 className="ai-title">AI Legal Assistant</h1>
//         <p className="ai-tagline">
//           Ask questions related to CourtLink and Indian legal procedures.
//         </p>

//         <div className="chat-box">
//           {chat.length === 0 && (
//             <p style={{ color: "gray", fontStyle: "italic" }}>
//               Example: "What documents are required for a consumer complaint?"
//             </p>
//           )}

//           {chat.map((msg, index) => (
//             <div
//               key={index}
//               className={msg.sender === "user" ? "chat-user" : "chat-bot"}
//             >
//               <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{msg.text}</pre>
//             </div>
//           ))}
//         </div>

//         <div className="chat-input">
//           <input
//             type="text"
//             placeholder="Type your question..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             disabled={loading}
//           />
//           <button onClick={handleSend} disabled={loading}>
//             {loading ? "Thinking..." : "Send"}
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Aiassistant;

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../newstyles.css";

function Aiassistant() {

  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSend = async () => {

    if (message.trim() === "") return;

    setChat((prev) => [...prev, { sender: "user", text: message }]);
    setLoading(true);

    try {

      const response = await fetch("http://localhost:5000/api/ai/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: message }),
      });

      const data = await response.json();

      setChat((prev) => [
        ...prev,
        { sender: "bot", text: data.answer || "No response from AI." },
      ]);

    } catch (error) {

      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Backend not responding. Please try again later." },
      ]);

    }

    setMessage("");
    setLoading(false);
  };

  return (
    <div className="client-dashboard-new">

      {/* HEADER */}

      <div className="page-header-new">

        <h1 className="page-title-new">AI Legal Assistant</h1>

        <button
          className="dashboard-btn-new"
          onClick={() => navigate("/dashboard/client")}
        >
          ← Dashboard
        </button>

      </div>

      <p className="ai-tagline-new">
        Ask questions related to CourtLink and Indian legal procedures.
      </p>

      {/* CHAT BOX */}

      <div className="chat-box-new" ref={chatBoxRef}>

        {chat.length === 0 && (
          <p className="chat-placeholder">
            Example: "What documents are required for a consumer complaint?"
          </p>
        )}

        {chat.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? "chat-user-new" : "chat-bot-new"}
          >
            <pre>{msg.text}</pre>
          </div>
        ))}

      </div>

      {/* INPUT */}

      <div className="chat-input-new">

        <input
          type="text"
          placeholder="Type your question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />

        <button onClick={handleSend} disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </button>

      </div>

    </div>
  );
}

export default Aiassistant;