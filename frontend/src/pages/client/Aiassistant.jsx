import { useState } from "react";
import Sidebar from "../../components/ClientSidebar";

function Aiassistant() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (message.trim() === "") return;

    const userMsg = { sender: "user", text: message };

    setChat((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/ai/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: message }),
      });

      const data = await response.json();

      const botMsg = {
        sender: "bot",
        text: data.answer || "No response received from AI.",
      };

      setChat((prev) => [...prev, botMsg]);
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
    <div className="client-layout">
      <Sidebar />

      <main className="client-content">
        <h1 className="ai-title">AI Legal Assistant</h1>
        <p className="ai-tagline">
          Ask any questions related to your case, documents, or legal process.
        </p>

        <div className="chat-box">
          {chat.length === 0 && (
            <p style={{ color: "gray", fontStyle: "italic" }}>
              Ask something like: "What documents are required for divorce case?"
            </p>
          )}

          {chat.map((msg, index) => (
            <div
              key={index}
              className={msg.sender === "user" ? "chat-user" : "chat-bot"}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-input">
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
      </main>
    </div>
  );
}

export default Aiassistant;
