var http = require('http'),
  io = require('socket.io');

var server = http.createServer();

server.listen(8080);

// socket.io
var io = io.listen(server),
  buffer = [],
  users = [];
 
// IDEA: make key of user buffer the connection id instead of username to all duplicates
//
 
io.sockets.on('connection', function(socket) {
	
	socket.emit('buffer', buffer);	

	socket.on('user', function(user, fn) {
		if(user in users) { // if user already in users
			fn(true); // then return true
		} else {
			fn(false);
			socket.user = user; // add user to buffer
			if(users.length == 0) {
				socket.player = 'cross';
				users.push({'user':user, 'player': 'cross'});
			} else if(users.length == 1) {
				socket.player = 'nought';
				users.push({'user':user, 'player': 'nought'});
			} else {
				socket.player = '';
				users.push({'user': user, 'player' : '' });
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

		// TODO
		delete users[socket.user];
		socket.broadcast.emit('announcement', socket.user + ' disconnected');
		socket.broadcast.emit('users', users);
	});
});


