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
var socket = new io.connect(null, {port: 8080});

socket.on('connect', function() {

});

// annoncements
socket.on('announcement', function(msg) {
	console.log(msg);
	$('#chat #messages ul').append('<li><em>'+msg+'</em></li>');
});

socket.on('users', function(users) {
	$('#user_list').empty();
	for (var i in users) {
		$('#user_list').append($('<li>').text(users[i]));
	}
});

socket.on('message', message);

function clear() {
	$('#message').val('').focus();
};

function message(from, msg) {
	console.log(from+' '+msg);
	$('#chat #messages ul').append('<li><b>'+from+'</b> '+msg+'</li>');
}

$(document).ready(function(){
   
   // Add jquery 

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



