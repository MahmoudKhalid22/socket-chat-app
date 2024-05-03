import express from "express";
import http from "http";
import dotenv from "dotenv";
import path from "path";
import { Server } from "socket.io";
import generateMessage from "./utils/message";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const publicDirPath = path.join(__dirname, "./public");

app.use(express.static(publicDirPath));

// let count = 0;

io.on("connection", (socket) => {
  console.log("New websocket connection");

  socket.on("message", (message, cb) => {
    io.emit("message", generateMessage(message));
    cb("delivered");
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("message", generateMessage("client left"));
  });
  socket.on("location", (location, cb) => {
    io.emit(
      "location",
      generateMessage(
        `https://google.com/maps?q=${location.lat},${location.long}`
      )
    );
    cb("your location has been shared");
  });

  socket.on("join", ({ username, room }) => {
    socket.join(room);

    // io.emit, socket.emit, socket.broadcast.emit()
    // io.to().emit, socket.to.emit(), socket.broadcast.to().emit()

    socket.emit("message", generateMessage("welcome!"));
    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${username} has joined`));
  });

  //   socket.on("increment", () => {
  //     count++;
  //     io.emit("countUpdated", count);
  //   });
});

const port = process.env.PORT;

server.listen(port, () => {
  console.log("Server is running on port http://localhost:" + port);
});
