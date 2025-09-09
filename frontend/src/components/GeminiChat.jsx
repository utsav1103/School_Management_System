import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
//import { baseApi } from "../environment";

export default function GeminiChat() {
  const { authenticated } = useContext(AuthContext);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [open , setOpen] = useState(false);
  const handleSend = async () => {
    try {
      const token = localStorage.getItem("token"); //grabs the saved token form lcaltorage
      const res = await axios.post(`/api/gemini/chat`, { prompt },
        {headers: {Authorization: `Bearer ${token}`},}
      );
      setResponse(res.data.response);
    } catch (err) {
      console.error(err);
      setResponse("Error connecting to Gemini API");
    }
  };
  if(!authenticated) return null ;

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
           style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "linear-gradient(135deg, #ff1800, #ff5722)", // orange gradient
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            cursor: "pointer",
            fontSize: "1.8rem",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          💬
        </button>
      )}

      {/* Chatbox */}
      {open && (
        <div
           style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "linear-gradient(135deg, #FF7E5F, #FF512F)",
            color: "white",
            borderRadius: "16px",
            width: "320px",
            boxShadow: "0px 6px 16px rgba(0,0,0,0.3)",
            zIndex: 1000,
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            animation: "slideUp 0.3s ease-out",
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
             style={{
              position: "absolute",
              top: "10px",
              right: "12px",
              border: "none",
              background: "transparent",
              fontSize: "1.2rem",
              color: "white",
              cursor: "pointer",
            }}
          >
            ✖
          </button>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Your School Ai something..."
            style={{
              width: "100%",
              height: "60px",
              marginBottom: "0.5rem",
              borderRadius: "10px",
              border: "none",
              padding: "0.6rem",
              resize: "none",
              fontSize: "0.95rem",
              outline: "none",
              color: "#333",
            }}
          />

          <button
            onClick={handleSend}
             style={{
              background: "white",
              color: "#FF512F",
              padding: "0.5rem",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              marginBottom: "0.5rem",
              fontWeight: "bold",
              transition: "0.2s",
            }}
          >
            Send
          </button>

            
          <div
             style={{
              maxHeight: "150px",
              overflowY: "auto",
              fontSize: "0.9rem",
              background: "rgba(255,255,255,0.9)",
              padding: "0.6rem",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#333",
            }}
          >
                        {response || "💡 Ask me anything about your school system!"}

          </div>
        </div>
      )}
    </>
  );
}
