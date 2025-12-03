const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // allow React frontend
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Listen for messages from clients
  socket.on("send_message", (data) => {
    // Attach sender id so each client knows who sent it
    io.emit("receive_message", { ...data, sender: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Optional: show a friendly message at root
app.get("/", (req, res) => {
  res.send("Socket.IO server is running 🚀");
});

server.listen(4000, () => {
  console.log("Server running on port 4000");
});