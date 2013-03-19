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
    var screen_constraints = {
        mandatory: {
            chromeMediaSource: 'screen'
        },
        optional: []
    };
    var constraints = {
        audio: false,
        video: screen_constraints
    };
    try {
      navigator.webkitGetUserMedia(constraints, successCallback, errorCallback);
    } catch (e) {
        alert("Are you sure you are using Chrome Canary with the corresponding chrome://flags enabled?");
    }
    function successCallback(stream) {
        //video.src = window.webkitURL.createObjectURL(stream);
        //video.style.webkitTransform = "rotateY(180deg)";
        console.log("Started Sharing Screen");
        localStream = stream;
    }
    function errorCallback(error) {
        console.log('An error occurred: [CODE ' + error.code + ']');
    }
}



startVideo();