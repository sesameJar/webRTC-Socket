let _io;


let listen = socket => {
    const io = _io
    console.log(socket.id)
    socket.on('ready', ()=> {
        console.log("READY", socket.id)
        socket.broadcast.emit('ready', socket.id)
    })

    socket.on("offer", (id, message) => {
        console.log('offer received')
        socket.to(id).emit("offer",socket.id, message )
    })

    socket.on("answer", (id, message) => {
        console.log('answer received')
        socket.to(id).emit('answer', socket.id, message)
    })

    socket.on('candidate',  (id, message) => {
        socket.to(id).emit('candidate', socket.id, message);
      });
}

module.exports = function(io) {
    _io = io
    return {listen}
}