import { useState, useEffect } from "react";
import "./App.css"; // ✅ Make sure App.css is included

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ Add loading state

  // Load messages from local storage only once when the app starts
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to local storage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true); // ✅ Show "Thinking..." message

    try {
      const response = await fetch("http://127.0.0.1:8000/chat/?prompt=" + encodeURIComponent(input), {
        method: "POST",
      });
      const data = await response.json();

      setMessages([...newMessages, { role: "bot", content: data.response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { role: "bot", content: "Something went wrong. Try again!" }]);
    } finally {
      setLoading(false); // ✅ Hide "Thinking..." message
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatHistory"); // Also clear from local storage
  };

  return (
    <div className="chat-container">
      <h1>Chatbot</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === "user" ? "user-message" : "bot-message"}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="thinking">🤔 Thinking...</div>} {/* ✅ Show while waiting */}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <button onClick={clearChat}>Clear Chat</button>
    </div>
  );
}

export default App;
