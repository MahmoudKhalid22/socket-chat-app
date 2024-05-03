// CLIENT EMIT MESSAGES
const form = document.querySelector("form");
const formInput = document.querySelector(".input");
const locationBtn = document.querySelector("#location");
const formBtn = document.querySelector(".btn");
const messageEl = document.getElementById("messages");
const sidbarEl = document.querySelector(".chat__sidebar");

// Templates
const msgTemplate = document.getElementById("message-template").innerHTML;
const loactionTemplate = document.getElementById("location-template").innerHTML;
const sidebarTemplate = document.getElementById("sidebar__template").innerHTML;

const socket = io();

const autoScroll = () => {
  // Scroll to the bottom
  messageEl.scrollTop = messageEl.scrollHeight;
};

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// ON GET MESSAGE
socket.on("message", (msg) => {
  const html = Mustache.render(msgTemplate, {
    username: msg.username,
    message: msg.text,
    createdAt: moment(msg.createdAt).format("h:mm a"),
  });
  messageEl.insertAdjacentHTML("beforeend", html);
  autoScroll();
});
// ON GET LOCATION
socket.on("location", (msg) => {
  console.log(msg);
  const html = Mustache.render(loactionTemplate, {
    username: msg.username,
    location: msg.text,
    createdAt: moment(msg.createdAt).format("h:mm a"),
  });
  messageEl.insertAdjacentHTML("beforeend", html);
  autoScroll();
});
// ON DISCONNECT CLIENT
socket.on("disconnect", (msg) => {
  console.log(msg);
});

let message = "";

formInput.addEventListener("change", (e) => {
  message = e.target.value;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formBtn.setAttribute("disabled", "disabled");

  socket.emit("message", message, (msg) => {
    formBtn.removeAttribute("disabled");

    formInput.value = "";
    formInput.focus();
  });
});

// CLIENT SEND HIS LOCATION

locationBtn.addEventListener("click", () => {
  //   if (!navigator.geolocation) {
  //     return alert(
  //       "This browser doesn't support geolocation, please try another"
  //     );
  //   }

  locationBtn.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position);
    socket.emit(
      "location",
      {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      },
      (msg) => {
        console.log(msg);
        locationBtn.removeAttribute("disabled");
      }
    );
  });
});

// GET ROOM DATA USERS

socket.on("roomData", (users) => {
  const html = Mustache.render(sidebarTemplate, {
    room: users.room,
    users: users.users,
  });

  sidbarEl.innerHTML("beforeend", html);
});

// SEND USERNAME AND ROOM
socket.emit("join", { username, room }, (err) => {
  if (err) {
    alert(err);
    location.href = "/";
  }
});

// COUNTER CHALLENGE
// socket.on("countUpdated", (count) => {
//   console.log("" + count);
// });
// document.querySelector(".btn")?.addEventListener("click", () => {
//   socket.emit("increment");
// });
