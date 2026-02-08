import { useState } from "react";

function Aiassistant() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const handleSend = () => {
    if (message.trim() === "") return;

    setChat([...chat, { sender: "user", text: message }]);
    setMessage("");

    // Temporary bot reply (later we connect AI API)
    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Hello! I am your AI Legal Assistant. How can I help you?" },
      ]);
    }, 500);
  };

  return (
    <div>
      <h1 className="ai-title">AI Legal Assistant</h1>
        <p className="ai-tagline">
        Ask any questions related to your case, documents, or legal process.
        </p>

      <div className="chat-box">
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
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Aiassistant;
