#Overview
IceComm is a client-side wrapper for Web Real-Time Communication (WebRTC). Developers are able to fully utilize the benefits of WebRTC without having to type any server-side code. Below is an example of a fully functional skype-like web application utilizing IceComm (demo can be found on this [jsfiddle](http://jsfiddle.net/kirby8u/jLzq04su/))
#Example
````
var comm = new IceComm('$2a$10$KqS6dKC1ic90tZ6Y4yepQ.soiOkH7Az7rS9umXSLckahsrzfDDK5e');

comm.connect("custom room name");

comm.on('connected', function(options) {
  createRemoteVideo(options.stream, options.callerID);
});

comm.on('local', function(options) {
  localVideo.src = options.stream;
});

comm.on('disconnect', function(options) {
  document.getElementById(options.callerID).remove();
});

function createRemoteVideo(stream, key) {
  var remoteVideo = document.createElement('video');
  remoteVideo.src = stream;
  remoteVideo.id = key;
  remoteVideo.autoplay = true;
  document.body.appendChild(remoteVideo);
}
````
#Getting Started
Inject IceComm script by place the following line in the beginning of your HTML file
````
<script type="text/javascript" src="http://icecomm.cloudapp.net/icecomm-0.0.5.js"></script>
````
Instantiate instance of IceComm object. Place valid API Key as the single parameter (API Keys can be generated from [launch page](http://icecomm.io/#/))
````
var comm = new IceComm(YOUR_API_KEY);
````
#.connect(roomname[,options])
Clients can create and join rooms with the following function:
````
var comm = comm.connect('roomname', options);
````
Clients can only be part of one room at a time, but can switch rooms by calling the .connect(roomname) method again. If the room is already populated with clients, each clients will fire the .on('connected', callback). If the client is the first in the room, the .isHost() method will return true.

Additionally, an optional second paramater can be passed to the connect method.
````
options = {
  stream: false, // allows the application to access the media stream, defaults to true
  limit: 2 // sets a limit to the number of clients that can join the specified room, default is limit
}
````
#.on('local', callback)
If the media stream is allowed, clients can access their local media stream with the following event listener:
````
comm.on('local', function(options) {
  localVideo.src = options.stream;
});
````
The options parameter includes the following properties:
````
options = {
  stream: stream, // the client's local stream
}
````
#.on('connected', callback)
````
When clients connect with one another (by joining the same room), the following callback is fired:
comm.on('connected', function(options) {
  remoteVideo.src = options.stream;
  remoteVideo.id = options.callerID;
});
````
The options parameter includes the following properties
````
options = {
  stream: stream, // the remote stream
  callerID: callerID // the ID of the remote client
}
````
#.on('disconnect', callback)
````
Other clients are notified when a client in their room disconnects. When a client closes the window, the following callback function is fired:
comm.on('disconnect', function(options) {
  document.getElementById(options.callerID).remove();
});
````
The options parameter includes the following properties:
````
options = {
  callerID: callerID // the ID of the client that disconnected
}
````
#.send(data[, callerID])
Clients can send data to other clients via the following method:
````
comm.send('hello');
````
By default the data is sent to all clients in the current room. An optional second parameter can be passed to specify individual client.
#.on('data', callback)
When a remote client sends data, the following callback fires:
````
#.on('data', function(options) {
  console.log(options.data);
});
````
The options parameter includes the following properties:
````
options = {
  data: data, // the data that was send from the remote client with the send method
  callerID: callerID // the ID of the client that called the send method
}
````
#Other Methods
````
comm.getLocalID(); // returns the client's ID
comm.getRemoteIDs(); // returns an array of the remote IDs in the room
comm.getRooms(); // returns a list of all active rooms (with at least one client per room)
comm.getRoomSize(); // returns the number clients in the current room
comm.isHost(); // return a boolean indicating if the client was the first client in the room
````

