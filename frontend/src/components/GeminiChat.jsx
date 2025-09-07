import { useState } from "react";
import axios from "axios";
import { baseApi } from "../environment";

export default function GeminiChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    try {
      const res = await axios.post(`/api/gemini/chat`, { prompt });
      setResponse(res.data.response);
    } catch (err) {
      console.error(err);
      setResponse("Error connecting to Gemini API");
    }
  };

  return (
    <div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask Gemini something..."
      />
      <button onClick={handleSend}>Ask Gemini</button>
      <p>{response}</p>
    </div>
  );
}
