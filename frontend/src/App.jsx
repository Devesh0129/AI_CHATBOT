import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch {
        localStorage.removeItem("chatMessages");
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    } else {
      localStorage.removeItem("chatMessages");
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    setLoading(true);

    const userMessage = { text: trimmedInput, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmedInput }),
      });

      const data = await response.json();
      const botText = data?.response || data?.error || "No response from AI.";

      setMessages((prev) => [...prev, { text: botText, sender: "bot" }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, I couldn't reach the AI service right now.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  return (
    <div className="app-shell">
      <div className="chat-panel">
        <header className="chat-header">
          <div>
            <p className="eyebrow">AI assistant</p>
            <h1>Chatbot</h1>
          </div>
          <span className="status-pill">Online</span>
        </header>

        <div className="chat-box" aria-live="polite">
          {messages.length === 0 && !loading ? (
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <p>Ask anything to get started.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={`${msg.sender}-${index}`} className={`message-row ${msg.sender}`}>
                <div className="message-bubble">
                  {msg.text}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="message-row bot">
              <div className="message-bubble thinking">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="composer">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <div className="actions">
            <button className="secondary" type="button" onClick={clearChat}>
              Clear
            </button>
            <button type="button" onClick={sendMessage} disabled={loading || !input.trim()}>
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
