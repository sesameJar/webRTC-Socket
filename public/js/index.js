let socket = io()

let localVideo = document.querySelector('.localVideo')
let remoteVideos = document.querySelector('.remoteVideos')
let submitBtn = document.querySelector('.sendAvatar')
let usersList = document.querySelector('.usersList')
let avatarList = document.getElementById('avatarList')
let peerConnections = {}

var lightwallet = new Lightwallet({ target: '*' })
lightwallet
	.getAvatars()
	.then(avatars => {
		avatars.forEach(avatar => {
			let option = document.createElement('option')
			option.value = avatar.symbol
			option.text = avatar.symbol
			avatarList.appendChild(option)
		})
	})
	.catch(console.error)

const config = {
	iceServers: [
		{
			urls: ['stun:stun.1.google.com:19302'],
		},
	],
}

const constraints = {
	video: true,
	audio: true,
}

submitBtn.addEventListener('click', event => {
	let avatar = avatarList.value
	socket.emit('avatar', avatar)
	avatarList.style.display = 'none'
	submitBtn.style.display = 'none'
	console.log(avatar)
})

socket.on('all-users', async users => {
	console.log('CLIENT :', users)
	usersList.innerHTML = ''
	for (user in users) {
		let li = document.createElement('li')
		let span = document.createElement('span')
		let clear = document.createElement('span')
		clear.className = 'clear'
		const blockie = blockies.create({
			seed: `${user}`,
		})

		span.innerHTML = `${user}`
		li.append(blockie, span, clear)
		usersList.appendChild(li)
		li.addEventListener('click', async event => {
			let id = users[user]
			console.log(users[user])
			console.log('li id', id)
			await getMediaDevices(id)
			await createOffer(id)
		})
	}
})

const createOffer = async id => {
	console.log('CREATE OFFER', 1)
	if (!(localVideo instanceof HTMLVideoElement) || !localVideo.srcObject) {
		console.log('CREATE OFFER', 3)

		await getMediaDevices(id)
	}
	console.log('CREATE OFFER', 2)

	const peerConnection = new RTCPeerConnection(config)
	peerConnections[id] = peerConnection

	peerConnection.addStream(localVideo.srcObject)

	let SDP = await peerConnection.createOffer()
	await peerConnection.setLocalDescription(SDP)
	socket.emit('offer', id, peerConnection.localDescription)

	peerConnection.onaddstream = event =>
		handleRemoteStreamAdded(event.stream, id)
	peerConnection.onicecandidate = event => {
		if (event.candidate) {
			socket.emit('candidate', id, event.candidate)
		}
	}
	console.log(1)
}

socket.on('offer', async (id, offer) => {
	console.log('OFFER CLIENT', id)

	if (!(localVideo instanceof HTMLVideoElement) || !localVideo.srcObject) {
		await getMediaDevices(id)
	}
	console.log('OFFER AFTER IF')
	const peerConnection = new RTCPeerConnection(config)
	peerConnections[id] = peerConnection
	peerConnection.addStream(localVideo.srcObject)

	peerConnection.setRemoteDescription(offer) // !! AWAITS NOT NEEDED FOR REMOTE DESCRIPTION
	let SDP = await peerConnection.createAnswer()
	peerConnection.setLocalDescription(SDP)

	socket.emit('answer', id, peerConnection.localDescription)
	peerConnection.onaddstream = event =>
		handleRemoteStreamAdded(event.stream, id)
	peerConnection.onicecandidate = event => {
		if (event.candidate) {
			socket.emit('candidate', id, event.candidate)
		}
	}
})

socket.on('answer', (id, answer) => {
	console.log('ANSWER SERVER')
	peerConnections[id].setRemoteDescription(answer)
})

socket.on('candidate', (id, candidate) => {
	peerConnections[id]
		.addIceCandidate(new RTCIceCandidate(candidate))
		.catch(e => console.error(e))
})

socket.on('bye', id => {
	terminateConnection(id)
})

let terminateConnection = id => {
	// peerConnections[id] && peerConnections[id].close()
	// delete peerConnections[id]
	// let localStream = localVideo.srcObject
	// let tracks = localStream.getTracks()
	// tracks.forEach(track => {
	// 	track.stop()
	// })
	// localVideo.srcObject = null
	// document
	// 	.querySelector('#' + id.replace(/[^a-zA-Z]+/g, '').toLowerCase())
	// 	.remove()
	// if (remoteVideos.querySelectorAll('video').length === 1) {
	// 	remoteVideos.setAttribute('class', 'one remoteVideos')
	// } else {
	// 	remoteVideos.setAttribute('class', 'remoteVideos')
	// }
}

let handleRemoteStreamAdded = (stream, id) => {
	let mediaStream = new MediaStream(stream)
	const remoteVideo = document.createElement('video')
	remoteVideo.srcObject = mediaStream
	remoteVideo.setAttribute('id', id.replace(/[^a-zA-Z]+/g, '').toLowerCase())
	remoteVideo.setAttribute('playsinline', 'true')
	remoteVideo.setAttribute('autoplay', 'true')
	remoteVideos.appendChild(remoteVideo)
	if (remoteVideos.querySelectorAll('video').length === 1) {
		remoteVideos.setAttribute('class', 'one remoteVideos')
	} else {
		remoteVideos.setAttribute('class', 'remoteVideos')
	}
}

let getMediaDevices = async id => {
	console.log(id)
	if (localVideo instanceof HTMLVideoElement) {
		if (!localVideo.srcObject) {
			let stream = await navigator.mediaDevices.getUserMedia(constraints)
			localVideo.srcObject = stream
		}
	} else {
		console.error('NO VIDEO TAG FOUND')
	}
}

// getMediaDevices();
