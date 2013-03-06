var localStream = null;
var peers = {};
var mediaConstraints = {'mandatory': {
                          'OfferToReceiveAudio':true,
                          'OfferToReceiveVideo':true }};

function processSignalingMessage(message) {
  var peerConn, msg = JSON.parse(message);

    if (msg.type === 'offer') {
        peerConn = createPeerConnection();

        // Save the peer connection
        peers[msg.uid] = peerConn;

        peerConn.addStream(localStream);

        //set remote description
        peerConn.setRemoteDescription(new RTCSessionDescription(msg));
        //create answer
        console.log("Sending answer to peer.");
        peerConn.createAnswer(setLocalAndSendMessage, null, mediaConstraints);
    }
    else if (msg.type === 'candidate') {
        var candidate = new RTCIceCandidate({sdpMLineIndex:msg.label, candidate:msg.candidate});

        peerConn = peers[msg.uid];
        peerConn.addIceCandidate(candidate);
    }
}

function startVideo() {
    // Replace the source of the video element with the stream from the camera
    try {
      navigator.webkitGetUserMedia({audio: true, video: true}, successCallback, errorCallback);
    } catch (e) {
      // Old way
      navigator.webkitGetUserMedia("video,audio", successCallback, errorCallback);
    }
    function successCallback(stream) {
        video.src = window.webkitURL.createObjectURL(stream);
        video.style.webkitTransform = "rotateY(180deg)";
        localStream = stream;
    }
    function errorCallback(error) {
        console.log('An error occurred: [CODE ' + error.code + ']');
    }
}



startVideo();