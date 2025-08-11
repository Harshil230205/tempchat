import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import Message from "./models/Message.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("sendMessage", async (msg) => {
    const newMsg = await Message.create(msg);
    io.emit("message", newMsg);
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
