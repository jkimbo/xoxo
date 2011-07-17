var http = require('http'),
  io = require('socket.io');

var server = http.createServer();

server.listen(8080);

// socket.io
var io = io.listen(server),
  buffer = {},
  users = {};
 
function oc(a) {
  var o = {};
  for(var i=0;i<a.length;i++) {
    o[a[i]]='';
  }
  return o;
}

io.sockets.on('connection', function(socket) {
	
	socket.on('user message', function (msg) {
		socket.broadcast.emit('user message', socket.nickname, msg);
	});

	socket.on('nickname', function (nick, fn) {
		if (users[nick]) {
			fn(true);
		} else {
			fn(false);
			users[nick] = socket.user = nick;
			socket.broadcast.emit('announcement', nick + ' connected');
			io.sockets.emit('users', users);
		}
	});
	
	socket.on('disconnect', function () {
		if (!socket.nickname) return;

		delete nicknames[socket.nickname];
		socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
		socket.broadcast.emit('nicknames', nicknames);
	});

});


