import express from "express"
import socket from "socket.io"
import credentials from "./credentials"
import https from "https"

const app = express()
let port
let server = https.createServer(credentials,app)
port = 443


app.use(express.static('public'))

let io = socket(server)


io.on('connection', socket => {
    console.log(socket.id)
})

server.listen(port, () => {
    console.log(`Lisnteing on ${port}`)
})