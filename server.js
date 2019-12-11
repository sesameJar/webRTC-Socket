import express from "express";
import socket from "socket.io";
import credentials from "./credentials";
import https from "https";
import socketServices from "./socketServices";

const app = express();
let port;
let server = https.createServer(credentials, app);
port = 1443;

app.use(express.static("public"));

const io = socket(server);

io.on("connection", socketServices(io).listen);

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
