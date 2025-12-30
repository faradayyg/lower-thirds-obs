// Extract roomId from URL path (/control/:roomId/)
const roomId = window.location.pathname.split("/")[2];

// Connect to socket.io with roomId
const socket = io({
  query: { roomId: roomId },
});

socket.on("connect", () => {
  console.log("Connected to socket.io, room:", roomId);
});

function getParameterByName(name) {
  return localStorage.getItem(name);
}

function load() {
  // Update form fields from localStorage
  const form = document.getElementById("controlForm");
  const fields = [
    "animation",
    "duration",
    "line1",
    "color1",
    "line2",
    "color2",
  ];
  fields.forEach((field) => {
    const input = form.elements[field];
    if (input) {
      const value = getParameterByName(field) || "";
      if (input.type === "radio") {
        const radioButton = form.querySelector(
          `input[name="${field}"][value="${value}"]`,
        );
        if (radioButton) {
          radioButton.checked = true;
        }
      } else {
        input.value = value;
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  load();
});

function updateLowerThird(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = {};

  for (const [key, value] of formData.entries()) {
    localStorage.setItem(key, value);
    data[key] = value;
  }

  const successDiv = document.getElementById("success");
  successDiv.style.display = "flex";
  socket.emit("updateLowerThird", { roomId: roomId, data: data });
  setTimeout(() => {
    successDiv.style.display = "none";
  }, 4000);
}

function hideLowerThird() {
  socket.emit("clearLowerThird", { roomId: roomId });
}
