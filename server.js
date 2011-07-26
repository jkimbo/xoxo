var http = require('http'),
  io = require('socket.io');

var server = http.createServer();

server.listen(8080);

// socket.io
var io = io.listen(server),
  buffer = {},
  users = {};
 
// IDEA: make key of user buffer the connection id instead of username to all duplicates
//
 
io.sockets.on('connection', function(socket) {
	
	socket.emit('users', users);	

	socket.on('user', function(user, fn) {
		if(users[user]) { // if user already in users
			fn(true); // then return true
		} else {
			fn(false);
			users[user] = socket.user = user; // add user to buffer
			socket.broadcast.emit('announcement', user + ' connected');
			io.sockets.emit('users', users);
		}
	});

	socket.on('message', function (msg) {
		socket.broadcast.emit('message', socket.user, msg);
	});

	socket.on('disconnect', function () {
		if(!socket.user) return;

		delete users[socket.user];
		socket.broadcast.emit('announcement', socket.user + ' disconnected');
		socket.broadcast.emit('users', users);
	});
});


