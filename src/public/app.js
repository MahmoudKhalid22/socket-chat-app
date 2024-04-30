const socket = io();

// ON GET MESSAGE
socket.on("message", (msg) => {
  console.log(msg);
});
// ON DISCONNECT CLIENT
socket.on("disconnect", (msg) => {
  console.log(msg);
});

// CLIENT EMIT MESSAGES
const form = document.querySelector("form");
const msg = document.querySelector("input");
const locationBtn = document.querySelector("#location");
let message = "";

msg.addEventListener("change", (e) => {
  message = e.target.value;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("message", message);
});

// CLIENT GET LOCATION

locationBtn.addEventListener("click", () => {
  //   if (!navigator.geolocation) {
  //     return alert(
  //       "This browser doesn't support geolocation, please try another"
  //     );
  //   }
  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position);
    socket.emit("location", {
      lat: position.coords.latitude,
      long: position.coords.longitude,
    });
  });
});

// COUNTER CHALLENGE
// socket.on("countUpdated", (count) => {
//   console.log("" + count);
// });
// document.querySelector(".btn")?.addEventListener("click", () => {
//   socket.emit("increment");
// });
