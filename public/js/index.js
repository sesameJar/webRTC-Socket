let socket = io();

let localVideo = document.querySelector(".localVideo");
let remoteVideos = document.querySelector(".remoteVideos");
// let remoteVideoTag = document.getElementById("remoteVideoTag")
let submitBtn = document.querySelector(".sendAvatar");
let avatarTag = document.querySelector("#avatar");
let usersList = document.querySelector(".usersList");
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

submitBtn.addEventListener("click", event => {
  socket.emit("avatar", avatarTag.value);
  console.log(avatarTag.value);
});

socket.on("all-users", async users => {
  usersList.innerHTML = "";
  for (user in users) {
    let li = document.createElement("li");
    li.innerHTML = `User ${user} has id : ${users[user]}`;
    usersList.appendChild(li);
    li.addEventListener("click", async event => {
      let id = users[user];
      await getMediaDevices(id);
      await createOffer(id);
    });
  }
});

const createOffer = async id => {
  console.log("createOffer");
  if (!(localVideo instanceof HTMLVideoElement) || !localVideo.srcObject) {
    await getMediaDevices(id);
  }

  const peerConnection = new RTCPeerConnection(config);
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
  console.log("END OF OFFER");
};

// socket.on("ready", async id => {
//   if (!(localVideo instanceof HTMLVideoElement) || !localVideo.srcObject) {
//     return;
//   }

//   const peerConnection = new RTCPeerConnection(config);
//   peerConnections[id] = peerConnection;

//   peerConnection.addStream(localVideo.srcObject);

//   let SDP = await peerConnection.createOffer();
//   await peerConnection.setLocalDescription(SDP);
//   socket.emit("offer", id, peerConnection.localDescription);

//   peerConnection.onaddstream = event =>
//     handleRemoteStreamAdded(event.stream, id);
//   peerConnection.onicecandidate = function(event) {
//     if (event.candidate) {
//       socket.emit("candidate", id, event.candidate);
//     }
//   };
// });

socket.on("offer", async (id, offer) => {
  console.log("OFFER RECEIVED CLIENT");
  if (!(localVideo instanceof HTMLVideoElement) || !localVideo.srcObject) {
    await getMediaDevices(id);
  }

  const peerConnection = new RTCPeerConnection(config);
  peerConnections[id] = peerConnection;
  peerConnection.addStream(localVideo.srcObject);

  peerConnection.setRemoteDescription(offer); // !! AWAITS NOT NEEDED FOR REMOTE DESCRIPTION
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

socket.on("bye", id => {
  terminateConnection(id);
});

let terminateConnection = id => {
  peerConnections[id] && peerConnections[id].close();
  delete peerConnections[id];
  let localStream = localVideo.srcObject
  let tracks = localStream.getTracks()
  tracks.forEach(track => {
    track.stop()
  })
  localVideo.srcObject = null
  document
    .querySelector("#" + id.replace(/[^a-zA-Z]+/g, "").toLowerCase())
    .remove();
  if (remoteVideos.querySelectorAll("video").length === 1) {
    remoteVideos.setAttribute("class", "one remoteVideos");
  } else {
    remoteVideos.setAttribute("class", "remoteVideos");
  }

};

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

let getMediaDevices = async id => {
  console.log(id);
  if (localVideo instanceof HTMLVideoElement) {
    if (!localVideo.srcObject) {
      let stream = await navigator.mediaDevices.getUserMedia(constraints);
      localVideo.srcObject = stream;
    }
  } else {
    console.error("NO VIDEO TAG FOUND");
  }
};

// getMediaDevices();
