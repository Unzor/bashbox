const fs = require("fs");
const process = require("process");

const express = require("express");
const ws = require("express-ws");
const pty = require("node-pty");

const html = fs.readFileSync("index.html");

const app = express();

ws(app);

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(__dirname + '/index.html');
});
app.ws("/ws", (ws) => {
  const term = pty.spawn("sh", [], { name: "xterm-color" });
  setTimeout(() => term.kill(), 3600 * 1000); // session timeout
  term.on("data", (data) => {
    try {
      ws.send(data);
    } catch (err) {}
  });
  ws.on("message", (data) => term.write(data));
});

app.listen(parseInt(8080), "0.0.0.0");
