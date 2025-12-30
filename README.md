[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Lower Thirds for OBS Studio

Professional animated lower thirds with real-time peer-to-peer control for OBS Studio using HTML, JavaScript, CSS, and PeerJS.

## Demo

<div>
    <a href="https://www.loom.com/share/8a6005a230f841bdb3a27082dee7c2df">
      <p>Lower Thirds for OBS Studio  - Watch Video</p>
    </a>
    <a href="https://www.loom.com/share/8a6005a230f841bdb3a27082dee7c2df">
      <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/8a6005a230f841bdb3a27082dee7c2df-914f51b6988ac912-full-play.gif#t=0.1">
    </a>
  </div>

> 👆 Click to watch the demo video

## Features

- **5 Animation Styles** - Choose from 5 different professional lower third animations
- **Real-Time Control** - Update text, colors, and animations instantly via peer-to-peer connection
- **No Server Required** - Uses PeerJS for direct browser-to-browser communication
- **Responsive Design** - Animations scale based on container size using CSS container queries
- **Connection Status** - Visual indicators show connection state in the control panel
- **Customizable** - Text color, accent color, duration, and animation style options
- **Easy to Use** - Simple web interface with copyable URLs for OBS

## Based On

This project is based on the After Effects template by Amaksi:

- http://videohive.net/item/lower-thirds/10338608
- Original codepen: https://codepen.io/mattchestnut/pen/dMrONe

## Quick Start

### 1. Installation

This is plain HTML, no installation is required

use this url: http://obs.fdrs.dev/

### 2. Setup

1. Open `https://obs.fdrs.dev/` in your browser
2. Click **"Generate New Room"** to create a unique room ID
3. Copy the **Display URL** (must be opened first)
4. Copy the **Control Panel URL**

### 3. OBS Configuration

1. In OBS Studio, add a new **Browser Source**
2. Paste the **Display URL** into the URL field
3. Set Width: `1920`, Height: `100` (or your preferred resolution)
4. Click OK

### 4. Control Panel

1. Open the **Control Panel URL** in a browser tab or a custom dockable tab (recommended)
2. Wait for the connection status to show **"Connected to display"** (green)
3. Enter your text in Line 1 and Line 2
4. Configure colors, duration, and animation style in **Advanced Settings**
5. Click **"Update Lower Third"** to show the animation
6. Click **"Hide"** to clear the display

## Important Notes

⚠️ **Always open the Display page BEFORE opening the Control Panel**

The display creates a peer connection that the control panel connects to.

## Architecture

### Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Peer-to-Peer**: PeerJS (WebRTC)
- **Storage**: localStorage for settings persistence

### How It Works

1. **Display Page** (`/lower/?room=abc123`):
   - Creates a PeerJS peer with ID `display-{roomId}`
   - Waits for incoming connections
   - Renders animations when data is received

2. **Control Panel** (`/control/?room=abc123`):
   - Creates a PeerJS peer with auto-generated ID
   - Connects to the display peer
   - Sends animation data via WebRTC DataChannel

3. **Peer-to-Peer Communication**:
   - Direct browser-to-browser connection
   - No server relay after initial signaling
   - Low latency updates

## Animation Styles

1. **Style 1**: Slash separator with sliding text
2. **Style 2**: Vertical slide animation
3. **Style 3**: Horizontal split animation
4. **Style 4**: Simple slide with color bar
5. **Style 5**: Border frame animation

Preview GIFs are available in the control panel.

## Customization Options

### Text

- Line 1: Primary text (name, title, etc.)
- Line 2: Secondary text (subtitle, role, etc.)

### Colors

- **Text Color**: White, Black, Gray, Yellow, Cyan
- **Accent Color**: Red, Blue, Green, Orange, Purple, Yellow, Teal, Pink

### Animation

- **Duration**: 1-60 seconds (how long the animation stays visible)
- **Style**: Choose from 5 different animation styles

## API / Data Format

Messages sent via PeerJS DataChannel:

```javascript
// Update animation
{
  type: "update",
  data: {
    line1: "John Doe",
    line2: "Motion Designer",
    color1: "ffffff",
    color2: "cf4c4e",
    animation: "1",
    duration: "10"
  }
}

// Hide animation
{
  type: "hide"
}
```

## Development

### File Structure

```
lower-thirds-obs/
├── index.html          # Landing page with room generator
├── control.html        # Control panel interface
├── lower.html          # Display page for OBS
├── index.js            # Express server
├── css/
│   └── lower.css       # Styles for animations and UI
├── js/
│   ├── control.js      # Control panel logic
│   └── lower.js        # Display page logic
└── img/
    └── *.gif           # Animation preview images
```

### Key Features Implementation

- **Responsive Animations**: CSS container queries (`cqw` units)
- **Connection Status**: Visual indicators (connecting, connected, disconnected, error)
- **Advanced Settings**: Collapsible section for optional controls
- **URL Query Parameters**: Room IDs passed as `?room=abc123`

## Troubleshooting

### Connection Issues

If the control panel shows "Disconnected" or "Error":

1. Make sure the **Display page is open first**
2. Check that both pages have the same room ID
3. Refresh the Display page, then the Control Panel
4. Check browser console for errors

### Animations Not Showing

1. Verify the Display page is open in OBS or a browser
2. Check the connection status in the Control Panel (should be green)
3. Make sure you clicked "Update Lower Third" after entering text
4. Check OBS browser source settings (URL, size, visibility)

### Emojis Not Displaying

All HTML files include proper charset declarations:

```html
<meta charset="UTF-8" />
```

If emojis still don't show, check your browser/OBS encoding settings.

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- OBS Browser: ✅ Full support (CEF-based)

## License

MIT License - See LICENSE file for details

## Credits

- Original After Effects template: [Amaksi](http://videohive.net/item/lower-thirds/10338608)
- Original codepen: [Matt Chestnut](https://codepen.io/mattchestnut/pen/dMrONe)
- PeerJS: [PeerJS](https://peerjs.com/)
- Forked from [lower thirds OBS by Vasco Cruz](https://github.com/vjccruz/lower-thirds-obs)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
