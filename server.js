var http = require('http'),
  io = require('socket.io');

var server = http.createServer();

server.listen(8080);

// socket.io
var io = io.listen(server),
  buffer = {},
  users = {};
 
io.sockets.on('connection', function(socket) {
	
	socket.emit('message', { hello: 'world' });

});


