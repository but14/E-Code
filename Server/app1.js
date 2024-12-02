const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const httpServer = createServer(app);

// Cấu hình CORS cho Express
app.use(cors({
  origin: '*',
  methods: 'GET, POST, OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Hoặc thay đổi theo URL của ứng dụng của bạn
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Lắng nghe sự kiện 'message' từ client
  socket.on("77", (message) => {
    console.log("Received message from client:", message);

    // Phản hồi lại client
    socket.emit("new-message", { user: 'Server', message: message });
  });

  // Xử lý khi người dùng ngắt kết nối
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
