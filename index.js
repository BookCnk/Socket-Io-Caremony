import dotenv from "dotenv";
dotenv.config(); // โหลด .env

import express from "express";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";

const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

io.on("connection", async (socket) => {
  console.log("✅ Client connected:", socket.id);

  try {
    const resOverview = await axios.get(
      `${backendUrl}/api/v1/graduate/overview`
    );
    socket.emit("graduate-overview", {
      status: "success",
      data: resOverview.data,
    });
    console.log("📤 ส่ง graduate-overview ไปยัง client", resOverview.data);
  } catch (err) {
    console.error("❌ ดึงข้อมูล overview ไม่สำเร็จ:", err.message);
  }

  // 👉 Summary
  try {
    const resSummary = await axios.get(`${backendUrl}/api/v1/summary/overview`);
    socket.emit("graduate-summary", {
      status: "success",
      data: resSummary.data,
    });
    console.log("📤 ส่ง graduate-summary ไปยัง client", resSummary.data.data);
  } catch (err) {
    console.error("❌ ดึงข้อมูล summary ไม่สำเร็จ:", err.message);
  }

  socket.on("request-summary", async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/v1/summary/overview`);
      io.emit("graduate-summary", {
        status: "success",
        data: res.data.data,
      });
      console.log(
        "📡 Broadcasted graduate-summary (on demand):",
        res.data.data
      );
    } catch (err) {
      console.error("❌ request-summary failed:", err.message);
    }
  });

  socket.on("hello", (msg) => {
    console.log("💬 hello:", msg);
  });
});

app.post("/broadcast-graduate-overview", (req, res) => {
  const data = req.body;

  io.emit("graduate-overview", {
    status: "success",
    data,
  });

  console.log("📡 Broadcasted graduate-overview:", data);
  res.sendStatus(200);
});

app.post("/broadcast-summary-overview", (req, res) => {
  const data = req.body;

  io.emit("graduate-summary", {
    status: "success",
    data,
  });

  console.log("📡 Broadcasted graduate-summary:", data);
  res.sendStatus(200);
});

server.listen(3002, () => {
  console.log("🚀 Socket.IO server is running at http://localhost:3002");
});
