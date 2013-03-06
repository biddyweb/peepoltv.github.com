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
