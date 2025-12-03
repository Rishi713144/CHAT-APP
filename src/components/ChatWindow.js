// ChatWindow.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export default function ChatWindows() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });
    return () => socket.off("receive_message");
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send_message", {
        text: message,
        time: new Date().toLocaleTimeString()
      });
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>💬 Real-Time Chat</h2>
      <div
        style={{
          border: "1px solid #ccc",
          height: "200px",
          overflowY: "scroll",
          marginBottom: "10px"
        }}
      >
        {chat.map((msg, i) => (
          <p
            key={i}
            style={{
              textAlign: msg.sender === socket.id ? "right" : "left",
              background: msg.sender === socket.id ? "#dcf8c6" : "#fff",
              padding: "5px",
              borderRadius: "5px",
              margin: "5px"
            }}
          >
            <strong>{msg.time}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "70%" }}
      />
      <button onClick={sendMessage} style={{ width: "25%", marginLeft: "5px" }}>
        Send
      </button>
    </div>
  );
}