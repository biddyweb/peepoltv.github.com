var socket = new WebSocket('ws://192.168.10.110:1337/');  // change the IP address to your websocket server
var stunServer = "stun.l.google.com:19302";
var sourcevid = document.getElementById('sourcevid');
var remotevid = document.getElementById('remotevid');
var localStream = null;
var remoteStream;
var peerConn = null;
var started = false;
var mediaConstraints = {'mandatory': {
    'OfferToReceiveAudio':true,
    'OfferToReceiveVideo':true }};

// send the message to websocket server
function sendMessage(message) {
    var mymsg = JSON.stringify(message);
    console.log("SEND: " + mymsg);
    socket.send(mymsg);
}

function createPeerConnection() {
    try {
        console.log("Creating peer connection");
        var servers = [];
        servers.push({'url':'stun:' + stunServer});
        var pc_config = {'iceServers':servers};
        peerConn = new webkitRTCPeerConnection(pc_config);
        peerConn.onicecandidate = onIceCandidate;
    } catch (e) {
        console.log("Failed to create PeerConnection, exception: " + e.message);
    }

    peerConn.onaddstream = onRemoteStreamAdded;
}

// when remote adds a stream, hand it on to the local video element
function onRemoteStreamAdded(event) {
    console.log("Added remote stream");
    remotevid.src = window.webkitURL.createObjectURL(event.stream);
}

function onIceCandidate(event) {
    if (event.candidate) {
        sendMessage({type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate});
    } else {
        console.log("End of candidates.");
    }
}

// start the connection upon user request
function connect() {
    if (!started && localStream) {
        console.log("Creating PeerConnection.");
        createPeerConnection();
        console.log('Adding local stream...');
        peerConn.addStream(localStream);
        started = true;

        //create offer
        peerConn.createOffer(setLocalAndSendMessage, null, mediaConstraints);

    } else {
        alert("Local stream not running yet.");
    }
}

// accept connection request
socket.addEventListener("message", onMessage, false);
function onMessage(evt) {
    console.log("RECEIVED: " + evt.data);
    processSignalingMessage(evt.data);
}

function processSignalingMessage(message) {
    var msg = JSON.parse(message);

    if (msg.type === 'offer') {

        if (!started && localStream) {
            createPeerConnection();
            console.log('Adding local stream...');
            peerConn.addStream(localStream);
            started = true;

            //set remote description
            peerConn.setRemoteDescription(new RTCSessionDescription(msg));
            //create answer
            console.log("Sending answer to peer.");
            peerConn.createAnswer(setLocalAndSendMessage, null, mediaConstraints);

        }

    }
    else if (msg.type === 'answer' && started) {
        peerConn.setRemoteDescription(new RTCSessionDescription(msg));
    }
    else if (msg.type === 'candidate' && started) {
        var candidate = new RTCIceCandidate({sdpMLineIndex:msg.label, candidate:msg.candidate});
        peerConn.addIceCandidate(candidate);
    }
}

function setLocalAndSendMessage(sessionDescription) {
    peerConn.setLocalDescription(sessionDescription);
    sendMessage(sessionDescription);
}

function startVideo() {
    // Replace the source of the video element with the stream from the camera
    navigator.webkitGetUserMedia({audio: true, video: true},
        function(stream){
            sourcevid.src = window.webkitURL.createObjectURL(stream);
            sourcevid.style.webkitTransform = "rotateY(180deg)";
            localStream = stream;
        },
        function(){
            console.log('An error occurred: [CODE ' + error.code + ']');
        });
}