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

socket.on('message', function(data) {
	console.log(data);
});

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

});



