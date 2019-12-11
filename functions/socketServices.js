let _io;
let users = {};

let listen = socket => {
  const io = _io;
  console.log(socket.id);
  io.sockets.emit("all-users", users);
  console.log(Object.keys(io.sockets.sockets));

  socket.on("avatar", avatar => {
    users[avatar] = socket.id;
    console.log(users);
    io.sockets.emit("all-users", users);
  });

  // socket.on('ready', ()=> {
  //     console.log("READY", socket.id)
  //     socket.broadcast.emit('ready', socket.id)
  // })

  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });

  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });

  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("bye", socket.id);
    console.log(socket.id);
    console.log(Object.keys(io.sockets.sockets));
    let key = Object.keys(users).find(objKey => users[objKey] === socket.id);
    console.log(key);
    delete users[key];
    io.sockets.emit("all-users", users);
  });
};

module.exports = function(io) {
  _io = io;
  return { listen };
};
