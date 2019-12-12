let _io
let users = {}

let listen = socket => {
	console.log(socket.id)
	const io = _io
	// io.sockets.emit('all-users', users)

	socket.on('avatar', avatar => {
		users[avatar] = socket.id
		console.log(users)
		io.sockets.emit('all-users', users)
	})

	socket.on('offer', (id, message) => {
		console.log('OFFER SERVER', id, message)
		socket.to(id).emit('offer', socket.id, message)
	})

	socket.on('answer', (id, message) => {
		socket.to(id).emit('answer', socket.id, message)
	})

	socket.on('candidate', (id, message) => {
		socket.to(id).emit('candidate', socket.id, message)
	})

	// socket.on('disconnect', () => {
	//     socket.broadcast.emit('bye', socket.id)
	//     let key = Object.keys(users).find(objKey => users[objKey] === socket.id)
	//     delete users[key]
	//     io.sockets.emit('all-users', users)
	// })
}

module.exports = function(io) {
	_io = io
	return { listen }
}
