var peerConn = null;
var mediaConstraints = {'mandatory': {
                          'OfferToReceiveAudio':true,
                          'OfferToReceiveVideo':true }};
uid = uniqueToken();

function processSignalingMessage(message) {
  var msg = JSON.parse(message);

  if (msg.type === 'answer') {
    peerConn.setRemoteDescription(new RTCSessionDescription(msg));
  }
  else if (msg.type === 'candidate') {
    var candidate = new RTCIceCandidate({sdpMLineIndex:msg.label, candidate:msg.candidate});
    peerConn.addIceCandidate(candidate);
  }
}

// start the connection upon user request
function connect() {
    console.log("Creating PeerConnection.");
    createPeerConnection();
    console.log('Adding local stream...');

    peerConn.onaddstream = onRemoteStreamAdded;

    //create offer
    console.log("Sending offer to peer.");
    peerConn.createOffer(setLocalAndSendMessage, null, mediaConstraints);

}

function onRemoteStreamAdded(event) {
  console.log("Added remote stream");
  video.src = window.webkitURL.createObjectURL(event.stream);
}
