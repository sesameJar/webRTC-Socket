// import express from "express";
// import socket from "socket.io";
// import credentials from "./credentials";
// import https from "https";
// import socketServices from "./socketServices";

let express = require("express");
let socket = require("socket.io");
let credentials = require("./credentials");
let https = require("https");
let socketServices = require("./socketServices");

const app = express();

let server = https.createServer(credentials, app);

app.use(express.static("public"));

const io = socket(server);

io.on("connection", socketServices(io).listen);

server.listen(process.env.PORT || 1440, function() {
  console.log('Listening on 1440');
});
