import express from "express";
import socket from "socket.io";
import credentials from "./credentials";
import https from "https";
import socketServices from "./socketServices";

const app = express();

let server = https.createServer(credentials, app);

app.use(express.static("public"));


const io = socket(server);

io.on("connection", socketServices(io).listen);

server.listen(process.env.PORT || 1440,() => {
  console.log(`Listening on ${port}`);
});
