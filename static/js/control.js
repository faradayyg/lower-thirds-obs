// Extract roomId from URL path (/control/:roomId/)
const roomId = window.location.pathname.split("/")[2];

// PeerJS Setup - Control connects to display
const peer = new Peer();
let displayConnection = null;

peer.on("open", (id) => {
  console.log("PeerJS: Control peer created with ID:", id);

  // Connect to the display peer
  const displayPeerId = `display-${roomId}`;
  console.log("PeerJS: Attempting to connect to display:", displayPeerId);

  displayConnection = peer.connect(displayPeerId);

  displayConnection.on("open", () => {
    console.log("PeerJS: Connected to display successfully");
  });

  displayConnection.on("error", (err) => {
    console.error("PeerJS: Connection error:", err);
  });

  displayConnection.on("close", () => {
    console.log("PeerJS: Display connection closed");
  });
});

peer.on("error", (err) => {
  console.error("PeerJS: Peer error:", err);
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

  // Send via PeerJS
  if (displayConnection && displayConnection.open) {
    displayConnection.send({ type: "update", data: data });
    console.log("PeerJS: Sent update to display");
  } else {
    console.warn("PeerJS: Connection not open");
  }

  setTimeout(() => {
    successDiv.style.display = "none";
  }, 4000);
}

function hideLowerThird() {
  // Send via PeerJS
  if (displayConnection && displayConnection.open) {
    displayConnection.send({ type: "hide" });
    console.log("PeerJS: Sent hide command to display");
  } else {
    console.warn("PeerJS: Connection not open");
  }
}
