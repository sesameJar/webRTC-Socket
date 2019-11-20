let socket = io()

let localVideo = document.querySelector('.localVideo')
let remoteVideo = document.querySelector('.remoteVideo')

const constraints = {
    video : {facingMode : 'user'}
}



let getMediaDevices = async () => {
    if(localVideo instanceof HTMLVideoElement) {
        if(!localVideo.srcObject) {
            let stream = await navigator.mediaDevices.getUserMedia(constraints)
            localVideo.srcObject = stream
            socket.emit('ready')
        }

    }else {
        console.log('NO VIDEO TAG FOUND')
    }
}

getMediaDevices()