import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load messages from local storage when the app starts
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages)); // Load saved chat history
    }
  }, []);

  // Save messages to local storage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput(""); // Clear input immediately after sending

    try {
      const response = await fetch(`http://127.0.0.1:8000/chat/?prompt=${encodeURIComponent(input)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      const botMessage = { text: data.response || "No response from AI.", sender: "bot" };

      setMessages((prevMessages) => [...prevMessages, botMessage]); // Append AI response
    } catch (error) {
      setMessages((prevMessages) => [...prevMessages, { text: "Error connecting to AI.", sender: "bot" }]);
    }

    setLoading(false);
  };

  const clearChat = () => {
    setMessages([]); // Reset chat
    localStorage.removeItem("chatMessages"); // Clear from local storage
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot">Thinking...</div>}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>Send</button>
        <button className="clear-btn" onClick={clearChat}>Clear Chat</button>
      </div>
    </div>
  );
}

export default App;
