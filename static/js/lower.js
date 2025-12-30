const rootDiv = document.querySelector("#root");

// Extract roomId from URL path (/lower/:roomId/)
const roomId = window.location.pathname.split("/")[2];

// PeerJS Setup - Display acts as the receiver
const peerId = `display-${roomId}`;
const peer = new Peer(peerId);

peer.on("open", (id) => {
  console.log("PeerJS: Display peer created with ID:", id);
});

peer.on("connection", (conn) => {
  console.log("PeerJS: Control connected:", conn.peer);

  conn.on("data", (data) => {
    console.log("PeerJS: Received data:", data);

    if (data.type === "update") {
      // Update localStorage with new data
      for (const [key, value] of Object.entries(data.data)) {
        localStorage.setItem(key, value);
      }
      load();
    } else if (data.type === "hide") {
      rootDiv.innerHTML = "";
    }
  });

  conn.on("close", () => {
    console.log("PeerJS: Control disconnected");
  });

  conn.on("error", (err) => {
    console.error("PeerJS: Connection error:", err);
  });
});

peer.on("error", (err) => {
  console.error("PeerJS: Peer error:", err);
});

function getParameterByName(name, url) {
  return localStorage.getItem(name);
}

function getDefaultAnimationDuration(id) {
  switch (id) {
    case "1":
      return "4s";
    case "2":
      return "3s";
    case "3":
      return "3.2s";
    case "4":
      return "3s";
    case "5":
      return "3.1s";
    default:
      return "3s";
  }
}

function getAnimationContext() {
  var animationId = getParameterByName("animation") || "1";
  var animationDuration = getParameterByName("duration");
  var line1 = getParameterByName("line1") || "John Doe";
  var color1 = getParameterByName("color1") || "fff";
  var line2 = getParameterByName("line2") || "Motion Designer";
  var color2 = getParameterByName("color2") || "cf4c4e";

  return {
    animationId,
    color1,
    color2,
    line1,
    line2,
    animationDuration,
  };
}

function getAnimationHtml(animationId, line1, line2, color2) {
  let html = "";

  switch (animationId) {
    case "1":
      html += '<div id="animation-1" class="animation">';
      html += '    <div class="color2">/</div>';
      html += '    <div class="color1 light mask">';
      html += `      <div>${line1}</div>`;
      html += "    </div>";
      html += '    <div class="color1 light mask">';
      html += `      <div>${line2}</div>`;
      html += "    </div>";
      html += "</div>";
      break;

    case "2":
      html += '<div id="animation-2" class="animation">';
      html += '    <div class="color2 bold arimo mask">';
      html += `      <div>${line1}</div>`;
      html += "    </div>";
      html += '    <div class="color1 light mask">';
      html += `      <div>${line2}</div>`;
      html += "    </div>";
      html += "</div>";
      break;

    case "3":
      html += '<div id="animation-3" class="animation">';
      html += '    <div class="color1 light mask">';
      html += `      <div>${line1}</div>`;
      html += "    </div>";
      html += '    <div class="color2 bold arimo mask">';
      html += `      <div>${line2}</div>`;
      html += "    </div>";
      html += "</div>";
      break;

    case "4":
      html += '<div id="animation-4" class="animation">';
      html += '    <div class="color1 bold arimo mask">';
      html += `      <div>${line1}</div>`;
      html += "    </div>";
      html += '    <div class="mask"><div class="back2"></div></div>';
      html += "</div>";
      break;

    default:
      html += '<div id="animation-5" class="animation">';
      html +=
        '    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">';
      html += "        <defs>";
      html += '            <clipPath id="mask-bottom-right">';
      html +=
        '                <rect class="clip-path" x="70%" y="0" width="30%" height="100%"/>';
      html += "            </clipPath>";
      html += '            <clipPath id="mask-top">';
      html +=
        '                <rect class="clip-path" x="0" y="0" width="100%" height="100%"/>';
      html += "            </clipPath>";
      html += '            <clipPath id="mask-bottom-left">';
      html +=
        '                <rect class="clip-path" x="0" y="0" width="30%" height="100%"/>';
      html += "            </clipPath>";
      html += "        </defs>";
      html +=
        '        <line class="bottom-right" x1="70%" y1="100%" x2="100%" y2="100%"/>';
      html +=
        '        <line class="right" x1="100%" y1="0" x2="100%" y2="100%"/>';
      html += '        <line class="top" x1="0" y1="0" x2="100%" y2="0"/>';
      html += '        <line class="left" x1="0" y1="0" x2="0" y2="100%"/>';
      html +=
        '        <line class="bottom-left" x1="0" y1="100%" x2="30%" y2="100%"/>';
      html += "    </svg>";
      html += '    <div class="color1 bold arimo mask">';
      html += `      <div>${line1}</div>`;
      html += "    </div>";
      html += '    <div class="color1 mask">';
      html += `      <div>${line2}</div>`;
      html += "    </div>";
      html += "</div>";
      html += "<style>";
      html += "#animation-5 line {";
      html += `  stroke: #${color2};`;
      html += "}";
      html += "</style>";
      break;
  }

  return html;
}

function generateStyles(color1, color2) {
  return `
        <style>
            .color1 {
                color: #${color1};
            }
            .color2 {
                color: #${color2};
            }
            .back1 {
                background-color: #${color1} !important;
            }
            .back2 {
                background-color: #${color2} !important;
            }
        </style>
    `;
}

function load() {
  const { animationId, color1, color2, line1, line2, animationDuration } =
    getAnimationContext();

  // Update form fields

  var r = document.querySelector(":root");
  const durationValue = animationDuration
    ? animationDuration.endsWith("s")
      ? animationDuration
      : `${animationDuration}s`
    : getDefaultAnimationDuration(animationId);
  r.style.setProperty(`--animation-${animationId}-duration`, durationValue);

  const animationHtml = getAnimationHtml(animationId, line1, line2, color2);
  const styles = generateStyles(color1, color2);
  document.querySelector("main").innerHTML = styles;

  console.log("Rendering animation...", animationHtml);
  rootDiv.innerHTML = animationHtml;
}

document.addEventListener("DOMContentLoaded", function () {
  load();
});
