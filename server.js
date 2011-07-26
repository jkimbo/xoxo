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
	
	socket.emit('buffer', buffer);	

	socket.on('user', function(user, fn) {
		if(users[user]) { // if user already in users
			fn(true); // then return true
		} else {
			fn(false);
			users[user] = socket.user = user; // add user to buffer
			console.log(users.length);
			if(users.length == 0) {
				// assign the user as cross
				console.log('cross');
				users['player'] = cross;
			} else if(users.lenght == 1) {
				// assign the users as nought
				users['player'] = nought;
			}
			socket.broadcast.emit('announcement', user + ' connected');
			io.sockets.emit('users', users);
		}
	});

	socket.on('message', function (msg) {
		socket.broadcast.emit('message', socket.user, msg);
	});

	socket.on('addcross', function(data) {
		data.user = socket.user;
		buffer = data;
		socket.broadcast.emit('addcross', data);
	});

	socket.on('disconnect', function () {
		if(!socket.user) return;

		delete users[socket.user];
		socket.broadcast.emit('announcement', socket.user + ' disconnected');
		socket.broadcast.emit('users', users);
	});
});


