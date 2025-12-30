import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const app = express();
const server = createServer(app);

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname, "static")));
app.enable("strict routing");

// Middleware to enforce trailing slashes
app.use((req, res, next) => {
  // Skip if already has trailing slash or is root
  if (req.path === "/" || req.path.endsWith("/")) {
    return next();
  }

  // Skip if path has a file extension (static files)
  if (req.path.match(/\.[a-zA-Z0-9]+$/)) {
    return next();
  }

  // Redirect to URL with trailing slash
  const query = req.url.slice(req.path.length);
  res.redirect(301, req.path + "/" + query);
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.get("/lower/:roomId/", (req, res) => {
  res.sendFile(join(__dirname, "lower.html"));
});

app.get("/control/:roomId/", (req, res) => {
  res.sendFile(join(__dirname, "control.html"));
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
