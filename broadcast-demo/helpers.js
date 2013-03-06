var socket = new WebSocket('ws://192.168.10.110:1337/');  // change the IP address to your websocket server
var stunServer = "stun.l.google.com:19302";
var uid = undefined;

function createPeerConnection() {
  try {
    console.log("Creating peer connection");
    var servers = [];
    servers.push({'url':'stun:' + stunServer});
    var pc_config = {'iceServers':servers};
    peerConn = new webkitRTCPeerConnection(pc_config);
    peerConn.onicecandidate = onIceCandidate;

    return peerConn;
  } catch (e) {
    console.log("Failed to create PeerConnection, exception: " + e.message);
  }
  // only in the listener
  /*if (!localStream) {
    peerConn.onaddstream = onRemoteStreamAdded;
  }*/
}

// send the message to websocket server
function sendMessage(message) {
    var mymsg = JSON.stringify(message);
    console.log("SEND: " + mymsg);
    socket.send(mymsg);
}

function onIceCandidate(event) {
  if (event.candidate) {
    var candidate = {type: 'candidate',
                 label: event.candidate.sdpMLineIndex,
                 id: event.candidate.sdpMid,
                 candidate: event.candidate.candidate};
    if(uid)
      candidate.uid = uid;
    sendMessage(candidate);
  } else {
    console.log("End of candidates.");
  }
}

function setLocalAndSendMessage(sessionDescription) {
  peerConn.setLocalDescription(sessionDescription);
  if(uid)
    sessionDescription.uid = uid;
  sendMessage(sessionDescription);
}

// accept connection request
socket.addEventListener("message", onMessage, false);
function onMessage(evt) {
  console.log("RECEIVED: " + evt.data);
  processSignalingMessage(evt.data);
}




//========================
// extras
//

function uniqueToken() {
    var s4 = function () {
        return Math.floor(Math.random() * 0x10000).toString(16);
    };
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
}

