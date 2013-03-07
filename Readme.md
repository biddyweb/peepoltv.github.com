# WEBRTC Playground

## General

### The websocket server
This is a simple websocket server.

Install dependencies

    npm install websocket
Now run it.

    node server.js

### The static files
Then you need to serve the static files. (Running the html files locally will produce a permission error). Go to the demo folder and there you can use:

    $ python -m SimpleHTTPServer

I use [tape](https://github.com/blackjid/tape)

    $ tape

## twoway-demo
This demo is a classic two-way videoconference over webrtc. The goal was to understand how webrtc and signaling over websockets work, so is a super simple demo.

*You will need to modify the websocket url in the `script.js` file to match the ip where the node server is running.*

Go to the `index.html` file on to computers (you can use to webcams also)

## broadcast-demo
This demo is a one to many broadcast over webrtc. The goal was to create a simple one-to-many broadcast understanding every line of code.

*You will need to modify the websocket url in the `helpers.js` file to match the ip where the node server is running*

### http://yourserver/host.html
This is the broadcaster. You will need to give usermedia permission and wait until you can see the video.

### http://yourserver/listener.html
You can open this file in several browsers and you will get the streamed video. Click the connect button to connect.

## forward-demo (not working)
This demo is to figure it out how to use a remote stream as a localstream. **NOTE:no node server is required**

There are 4 buttons:

* Start : starts the video
* Call : Send stream to the second video element thought peerconnections (without signaling)
* Forward : Send the remote stream to the 3rd video (not working)
* Hang Up