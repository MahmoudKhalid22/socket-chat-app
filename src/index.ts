import express from "express";
import http from "http";
import dotenv from "dotenv";
import path from "path";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const publicDirPath = path.join(__dirname, "./public");

app.use(express.static(publicDirPath));

io.on("connection", () => {
  console.log("New websocket connection");
});

const port = process.env.PORT;

server.listen(port, () => {
  console.log("Server is running on port " + port);
});
