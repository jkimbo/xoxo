/* 
	Author: J.Kim
*/

var Cross = Backbone.Model.extend({
	initialize: function(spec){
			console.log('New cross at '+spec.x+'-'+spec.y+' by '+spec.owner);	
		}
});

var Nought = Backbone.Model.extend({
	initialize: function(spec){
			console.log('New nought at '+spec.x+'-'+spec.y);
		}
});

var Crosses = Backbone.Collection.extend({
	model: Cross
});

var Noughts = Backbone.Collection.extend({
	model: Nought
});

var crosses = new Crosses;
var noughts = new Noughts;

/*
var GameView = Backbone.View.extend({
	tagName : 'div',
	el : '.cont',
	className : 'game',
	initialize: function() {
		console.log('View initialized');
		_.bindAll(this, "render");
	},
	render : function() {
		// Code for rendering the HTML for the view
		console.log('Render');
		console.log(this.model.toJSON());
		$(this.el).html(this.model.get('name'));
	}
});

var view = new GameView({
	model: portal
});
*/

// socket.io specific code
//var socket = io.connect('http://localhost:8000'); 
//var socket = new io.connect('http://localhost', {port: 8080}); 
var socket = new io.connect(null, {port: 8080});

socket.on('connect', function () {
	$('#chat').addClass('connected');
});

socket.on('announcement', function (msg) {
	$('#lines').append($('<p>').append($('<em>').text(msg)));
});

socket.on('nicknames', function (nicknames) {
	$('#nicknames').empty().append($('<span>Online: </span>'));
    for (var i in nicknames) {
		$('#nicknames').append($('<b>').text(nicknames[i]));
    }
});

socket.on('user message', message);

socket.on('reconnect', function () {
	$('#lines').remove();
	message('System', 'Reconnected to the server');
});

socket.on('reconnecting', function () {
	message('System', 'Attempting to re-connect to the server');
});

socket.on('error', function (e) {
	message('System', e ? e : 'A unknown error occurred');
});

function message (from, msg) {
	$('#lines').append($('<p>').append($('<b>').text(from), msg));
}


$(document).ready(function(){
   
   // Add jquery 
//	view.render();

	$('.square').click(function() {
		$(this).html('<span class="cross">X</span>').removeClass('active');
		var position = $(this).attr('id').split('_');
		position = position[1].split('x');
		new Cross({
			x: parseInt(position[0]),
			y: parseInt(position[1]),
			owner: 'jk'
		});
		return false;
	});

    // dom manipulation
    $('#set-nickname').submit(function (ev) {
		socket.emit('nickname', $('#nick').val(), function (set) {
			if (!set) {
				clear();
				return $('#chat').addClass('nickname-set');
            }
			$('#nickname-err').css('visibility', 'visible');
		});
        return false;
    });

    $('#send-message').submit(function () {
		message('me', $('#message').val());
        socket.emit('user message', $('#message').val());
        clear();
        $('#lines').get(0).scrollTop = 10000000;
        return false;
    });

    function clear () {
        $('#message').val('').focus();
    };
})



