let socket = io();

let localVideo = document.querySelector(".localVideo");
let remoteVideos = document.querySelector(".remoteVideos");
// let remoteVideoTag = document.getElementById("remoteVideoTag")
let peerConnections = {};

const config = {
  iceServers: [
    {
      urls: ["stun:stun.1.google.com:19302"]
    }
  ]
};

const constraints = {
  video: true,
  audio: true
};

socket.on("ready", async id => {
  if (!(localVideo instanceof HTMLVideoElement) || !localVideo.srcObject) {
    return;
  }

  const peerConnection = new RTCPeerConnection(config);
  console.log(peerConnection, "peerConnect<=");
  peerConnections[id] = peerConnection;

  peerConnection.addStream(localVideo.srcObject);

  let SDP = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(SDP);
  socket.emit("offer", id, peerConnection.localDescription);

  peerConnection.onaddstream = event =>
    handleRemoteStreamAdded(event.stream, id);
  peerConnection.onicecandidate = function(event) {
    if (event.candidate) {
      socket.emit("candidate", id, event.candidate);
    }
  };
});

socket.on("offer", async (id, offer) => {
  const peerConnection = new RTCPeerConnection(config);
  peerConnections[id] = peerConnection;
  peerConnection.addStream(localVideo.srcObject);

  peerConnection.setRemoteDescription(offer); // !! AWAITS NO NEEDED FOR REMOTE DESCRIPTION
  let SDP = await peerConnection.createAnswer();
  peerConnection.setLocalDescription(SDP);

  socket.emit("answer", id, peerConnection.localDescription);
  peerConnection.onaddstream = event =>
    handleRemoteStreamAdded(event.stream, id);
  peerConnection.onicecandidate = function(event) {
    if (event.candidate) {
      socket.emit("candidate", id, event.candidate);
    }
  };
});

socket.on("answer", (id, answer) => {
  peerConnections[id].setRemoteDescription(answer);
});

socket.on("candidate", (id, candidate) => {
  peerConnections[id]
    .addIceCandidate(new RTCIceCandidate(candidate))
    .catch(e => console.error(e));
});

let handleRemoteStreamAdded = (stream, id) => {
  let mediaStream = new MediaStream(stream);
  const remoteVideo = document.createElement("video");
  remoteVideo.srcObject = mediaStream;
  remoteVideo.setAttribute("id", id.replace(/[^a-zA-Z]+/g, "").toLowerCase());
  remoteVideo.setAttribute("playsinline", "true");
  remoteVideo.setAttribute("autoplay", "true");
  remoteVideos.appendChild(remoteVideo);
  if (remoteVideos.querySelectorAll("video").length === 1) {
    remoteVideos.setAttribute("class", "one remoteVideos");
  } else {
    remoteVideos.setAttribute("class", "remoteVideos");
  }
};

let getMediaDevices = async () => {
  if (localVideo instanceof HTMLVideoElement) {
    if (!localVideo.srcObject) {
      let stream = await navigator.mediaDevices.getUserMedia(constraints);
      localVideo.srcObject = stream;
      socket.emit("ready");
    }
  } else {
    console.error("NO VIDEO TAGG FOUND");
  }
};

getMediaDevices();
