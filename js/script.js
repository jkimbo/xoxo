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

var BoardView = Backbone.View.extend({
	initialize: function() {
		console.log('Board view initialized');
		crosses.bind("add", this.addCross);
		noughts.bind("add", function(nought) {
			alert(nought.get('owner'));
		});
	},
	render: function() {
		console.log(this.model.toJSON());
	},
	addCross: function(cross) {
		$('#'+cross.get('element')).html('<span class="cross">X</span>').removeClass('active');
		socket.emit('addcross', cross);
	}
});

var viewCrosses = new BoardView({
	model: crosses
});

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
var socket = new io.connect(null, {port: 8080});

socket.on('connect', function() {

});

// annoncements
socket.on('announcement', function(msg) {
	$('#chat #messages ul').append('<li><em>'+msg+'</em></li>');
	$('#messages').get(0).scrollTop = 10000000;
});

socket.on('users', function(users) {
	console.log(users);
	$('#user_list').empty();
	for (var i in users) {
		$('#user_list').append($('<li>').text(users[i]));
	}
});

socket.on('message', message);

socket.on('addcross', function(data) {
	console.log(data);
	crosses.add(data);
});

socket.on('buffer', function(data) {
	console.log(data);
});

function clear() {
	$('#message').val('').focus();
};

function message(from, msg) {
	console.log(from+' '+msg);
	$('#chat #messages ul').append('<li><b>'+from+'</b> '+msg+'</li>');
	$('#messages').get(0).scrollTop = 10000000;
}

$(document).ready(function(){
   
   // Add jquery 

	$('.square').click(function() {
		var position = $(this).attr('id').split('_');
		position = position[1].split('x');
		crosses.add({
			x: parseInt(position[0]),
			y: parseInt(position[1]),
			element: $(this).attr('id')
		});
		return false;
	});

	$('#set-nickname').submit(function() {
		$('#nickname').hide();
		$('#connecting').show();
		socket.emit('user', $('#name_input').val(), function(set) {
			if(!set) {
				console.log('Nickname set');
				$('#overlay').fadeOut(700);
			} else {
				console.log('Nickname not set');
				$('#nickname').show();
			}
		});
		return false;
	});

	// TODO:  add send verification
	$('#send-message').submit(function() {
		message('me', $('#message').val());
		socket.emit('message', $('#message').val());
		clear();
		return false;
	});
})



