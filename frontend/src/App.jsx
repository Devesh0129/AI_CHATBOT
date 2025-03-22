import { useState } from "react";
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat/", null, {
        params: { prompt },
      });
      setResponse(res.data.response);
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error fetching response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">AI Chatbot</h1>
      <form onSubmit={handleSubmit} className="flex w-full max-w-md space-x-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </form>
      <div className="mt-4 p-4 bg-white shadow-md rounded-md w-full max-w-md">
        {loading ? (
          <p className="text-gray-500 italic">Thinking...</p>
        ) : (
          <p className="text-gray-800">{response}</p>
        )}
      </div>
    </div>
  );
}

export default App;
