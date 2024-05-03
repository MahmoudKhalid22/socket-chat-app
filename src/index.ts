import express from "express";
import http from "http";
import dotenv from "dotenv";
import path from "path";
import { Server } from "socket.io";
import generateMessage from "./utils/message";
import { addUser, getUser, getUsers, removeUser, User } from "./utils/users";

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
    const user: User | undefined = removeUser(socket.id);
    if (user)
      socket.broadcast
        .to(user.room)
        .emit("message", generateMessage(`${user.username} has left`));
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

  socket.on("join", ({ username, room }, callback) => {
    const user: User | { error: string } = addUser({
      id: socket.id,
      username,
      room,
    });

    if ("room" in user) {
      socket.join(user!.room);

      // io.emit, socket.emit, socket.broadcast.emit()
      // io.to().emit, socket.to.emit(), socket.broadcast.to().emit()

      socket.emit("message", generateMessage("welcome!"));
      socket.broadcast
        .to(user.room)
        .emit("message", generateMessage(`${user.username} has joined`));
    } else {
      callback(user.error);
    }
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
