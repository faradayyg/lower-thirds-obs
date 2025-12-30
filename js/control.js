// Extract roomId from query parameter (/control/?room=abc123)
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("room");

// Function to update connection status UI
function updateConnectionStatus(status, message) {
  const statusEl = document.getElementById("connectionStatus");
  const statusText = statusEl.querySelector(".status-text");

  // Remove all status classes
  statusEl.classList.remove("connecting", "connected", "disconnected", "error");

  // Add the new status class
  statusEl.classList.add(status);

  // Update the message
  statusText.textContent = message;
}

// PeerJS Setup - Control connects to display
const peer = new Peer();
let displayConnection = null;

function connectToDisplay() {
  const displayPeerId = `display-${roomId}`;
  console.log("PeerJS: Attempting to connect to display:", displayPeerId);

  updateConnectionStatus("connecting", "Connecting to display...");
  displayConnection = peer.connect(displayPeerId);

  displayConnection.on("open", () => {
    console.log("PeerJS: Connected to display successfully");
    updateConnectionStatus("connected", "Connected to display");
  });

  displayConnection.on("error", (err) => {
    console.error("PeerJS: Connection error:", err);
    updateConnectionStatus("error", "Connection error");
  });

  displayConnection.on("close", () => {
    console.log("PeerJS: Display connection closed");
    updateConnectionStatus("disconnected", "Disconnected from display");
  });
}

peer.on("open", (id) => {
  console.log("PeerJS: Control peer created with ID:", id);
  connectToDisplay();
});

peer.on("error", (err) => {
  console.error("PeerJS: Peer error:", err);
  updateConnectionStatus("error", `Error: ${err.type}`);
});

// Function to reconnect to display
function reconnectToDisplay() {
  const refreshBtn = document.querySelector(".refresh-btn");

  // Disable button and add rotating animation
  refreshBtn.disabled = true;
  refreshBtn.classList.add("rotating");

  console.log("PeerJS: Reconnecting to display...");

  // Close existing connection if it exists
  if (displayConnection) {
    displayConnection.close();
    displayConnection = null;
  }

  // Wait a moment before reconnecting
  setTimeout(() => {
    connectToDisplay();

    // Re-enable button after connection attempt
    setTimeout(() => {
      refreshBtn.disabled = false;
      refreshBtn.classList.remove("rotating");
    }, 1000);
  }, 500);
}

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
