import express from "express";
import socket from "socket.io";
import credentials from "./credentials";
import https from "https";
import socketServices from "./socketServices";

const app = express();

let server = https.createServer(credentials, app);

app.use(express.static("public"));
app.set("port", process.env.PORT || 1440);

const io = socket(server);

io.on("connection", socketServices(io).listen);

server.listen(app.get("port"), () => {
  console.log(`Listening on ${port}`);
});
