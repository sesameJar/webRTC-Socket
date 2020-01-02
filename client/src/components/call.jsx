import React, { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client'
import { useParams } from 'react-router-dom'

const Call = ({ emitOffer }) => {
	let { remoteId } = useParams()
	const localVideo = useRef()
	const remoteVideo = useRef()

	const constraints = {
		video: true,
		// audio: true,
	}
	const config = {
		iceServers: [
			{
				urls: ['stun:stun.1.google.com:19302'],
			},
		],
	}
	const [localStream, setLocalStream] = useState(null)
	const [remoteStream, setRemoteStream] = useState(null)
	const [peerConnections, setPeerConnections] = useState({})

	let socket

	const getUserMedia = async () => {
		try {
			let stream = await navigator.mediaDevices.getUserMedia(constraints)
			localVideo.current.srcObject = stream
			setLocalStream(stream)
		} catch (error) {
			console.error(error)
		}
	}

	const handleRemoteStreamAdded = (stream, id) => {
		let mediaStream = new MediaStream(stream)
		setRemoteStream(mediaStream)
		remoteVideo.current.srcObject = mediaStream
	}

	const createOffer = async remoteId => {
		if (!localVideo.current.srcObject || !localStream) {
			await getUserMedia()
		}

		const peerConnection = new RTCPeerConnection(config)
		let pcObject = peerConnections
		pcObject[remoteId] = peerConnection
		setPeerConnections(pcObject)
		peerConnection.addStream(localVideo.current.srcObject)

		let SDP = await peerConnection.createOffer()
		await peerConnection.setLocalDescription(SDP)
		socket.emit('offer', remoteId, peerConnection.localDescription)

		peerConnection.onaddstream = event =>
			handleRemoteStreamAdded(event.stream, remoteId)
		peerConnection.onicecandidate = event => {
			if (event.candidate) {
				socket.emit('candidate', remoteId, event.candidate)
			}
		}
	}

	useEffect(() => {
		socket = io('https://localhost')

		getUserMedia()
		createOffer()
	}, [])

	// useEffect(() => {
	// 	console.log("Offer Effect")
	// 	socket.on('offer', () => {
	// 		console.log('OFFER IN APP')
	// 	})
	// 	return () => {
	// 		socket.on('disconnect')
	// 		socket.off()
	// 	}
	// }, [peerConnections])

	return (
		<>
			<video
				className="localVideo"
				style={{ width: 300, height: 300 }}
				autoPlay={true}
				ref={localVideo}
			/>
			<video
				className="remoteVideo"
				style={{ width: 300, height: 300 }}
				autoPlay={true}
				ref={remoteVideo}
			/>
		</>
	)
}

export default Call
