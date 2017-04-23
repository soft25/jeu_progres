var $ = require("jquery"); 
var socket = require('socket.io-client')(); 
<<<<<<< HEAD

var clientId = -1;
var sourisPosition = {};
var brushPositions = {};
var ballPositions ={};
var clients={};
var type="";
var type2="";
var point = 0;
=======
var clientId = -1;
var brushPositions = {};
var map = {};
var isMap = false;
var taille;
>>>>>>> a7f528e4c1ec5b501dbf0524a73ce598ecb57858

socket.emit('connection', {msg: "client"}); 

socket.on('hello', function(data) { 
 clientId = data.id;
<<<<<<< HEAD
 brushPositions[clientId]={x:data.x,y:data.y};
 type = data.type;
 console.log("client> connection reussi, id = "+clientId);		
});

socket.on('newconnection', function(data){
 brushPositions = data.brushPositions;
 clients = data.clients;
 type2 = data.type;
});

$(document).on("mousedown", function(event){
 socket.emit('mousedown',{x: brushPositions[clientId].x, y: brushPositions[clientId].y, id: clientId, xCurseur: event.clientX, yCurseur: event.clientY});
});

$(document).on("keyup", function(event){
 socket.emit('keyupdown',{x: brushPositions[clientId].x, y: brushPositions[clientId].y, id: clientId,keycode: event.keyCode});
});

$(document).on("keydown", function(event){
 socket.emit('keyupdown',{x: brushPositions[clientId].x, y: brushPositions[clientId].y, id: clientId,keycode: event.keyCode});
});

socket.emit('disconnect');
//-----------------------------------------------------------------------------------------------------
var canvas = document.getElementById('main');
var context = canvas.getContext('2d');

var img = new Image();
img.src = '/mur_30.png';
=======
 console.log("client> connection reussi, id = "+clientId); 
});

$(document).on("mousemove", function(event){
 socket.emit('mousemove',{x: event.clientX, y: event.clientY, id: clientId, map: map, taille: taille});
});

$(document).on("keyup", function(event){
 socket.emit('keyupdown',{x: brushPositions[clientId].x, y: brushPositions[clientId].y, id: clientId, keycode: event.keyCode, map: map, taille: taille});
// console.log("touche "+event.keyCode);
});

$(document).on("keydown", function(event){
 socket.emit('keyupdown',{x: brushPositions[clientId].x, y: brushPositions[clientId].y, id: clientId, keycode: event.keyCode, map: map, taille: taille});
// console.log("touche "+event.keyCode);
});

var canvas = document.getElementById('main');
var context = canvas.getContext('2d');

//var img = document.getElementById("mur"); 
var img = new Image();
img.src = "/mur_30.png";
>>>>>>> a7f528e4c1ec5b501dbf0524a73ce598ecb57858

var chat = new Image();
chat.src = "/chat.png";

<<<<<<< HEAD
var ball = new Image();
ball.src = "/magic_ball.png";

context.drawImage(chat,100,300);
//-----------------------------------------------------------------------------------------------------
function dessiner_mur(){
	ind = 0;
	for(var i = 0; i < 800; i += 30){
		for(var j = 0; j < $("#main").height(); j += 30){
			if(j==0 || j>= $("#main").height()-30){
				context.drawImage(img,i,j);				
			}else{
				context.drawImage(img,0,j);	
				context.drawImage(img,780,j);	
			}
		}	
	}//end for i
}
//--------------------------------------------------------------------------------------
function frameUpdate(){	
	
	if(type=="uBrushP" || type=="initialisation" ){	
		context.clearRect(0,0,canvas.width,canvas.height);
		context.fillStyle = "blue";
		context.fillRect(0, 0, 1000, 600);
		dessiner_mur();
				
		for(var i in brushPositions){		
			context.drawImage(chat,brushPositions[i].x, brushPositions[i].y);	
			context.font = '10pt Calibri';
		        context.fillStyle = 'black';
			context.fillText("id: "+i, brushPositions[i].x, brushPositions[i].y+50);	
		}

		if(type2 == "newclient"){
			var y = 40;
	 
			for(var i in clients){
				var id = clients[i].clientId;
				var nbrpoints = clients[i].nbrPoints;
				context.font = '13pt Calibri';
				if(id==clientId){
					context.fillStyle = 'red';
				}else{
					context.fillStyle = 'white';
				}			
				context.fillText("le joueur '"+id+"' a : "+nbrpoints+" points",820,y);	
				y = y+20;	
			}
	        }
	}else if(type=="uBallP") {
	
		context.clearRect(0,0,canvas.width,canvas.height);
		context.fillStyle = "blue";
		context.fillRect(0, 0, 1000, 600);
		dessiner_mur();

		for(var i in brushPositions){	
			context.drawImage(chat,brushPositions[i].x, brushPositions[i].y);
			context.font = '10pt Calibri';
		        context.fillStyle = 'black';
			context.fillText("id: "+i, brushPositions[i].x, brushPositions[i].y+50);
		}
		if(type2 == "newclient"){
			var y = 40;
	 
			for(var i in clients){
				var id = clients[i].clientId;
				var nbrpoints = clients[i].nbrPoints;
				context.font = '13pt Calibri';
				if(id==clientId){
					context.fillStyle = 'red';
				}else{
					context.fillStyle = 'white';
				}	
				context.fillText("le joueur '"+id+"' a : "+nbrpoints+" points",820,y);	
				y = y+20;			
			}
	        }		
		for(var i in ballPositions){	
			context.drawImage(ball,ballPositions[i].x, ballPositions[i].y);				
		}
	}
	window.requestAnimationFrame(frameUpdate);
}
frameUpdate();
//-----------------------------------------------------------------------------------------------------
socket.on('updatePosition', function(data) { 
	brushPositions = data.brushPositions;
	type = data.type;
});
//-----------------------------------------------------------------------------------------------------
socket.on('updateballPosition', function(data) { 
	ballPositions = data.ballPositions;
	type = data.type;
	clients = data.clients;
});

=======
/*img.onload = function() {
	context.drawImage(img,10,10);
};*/

function paintMur(){
	ind = 0;
	for(var i = 0; i < $("#main").width(); i += 30){
		for(var j = 0; j < $("#main").height(); j += 30){
			if(j==0 || j>= $("#main").height()-30){
				context.drawImage(img,i,j);
				if(!isMap)
					map[ind++] = {x: i, y: j, width: $("#main").width(), height: $("#main").height()};
			}
			else {
				context.drawImage(img,0,j);
				context.drawImage(img,$("#main").width()-30,j);
				if(!isMap){
					map[ind++] = {x: 0, y: j, width: $("#main").width(), height: $("#main").height()};
					map[ind++] = {x: $("#main").width()-30, y: j, width: $("#main").width(), height: $("#main").height()};
				}
			}
		}
	}

	if(!isMap){
		isMap = true;
		taille = ind;
		//printMap();
	}
}

function printMap(){
	console.log(taille);
	for(var i = 0; i < taille; i++)
		console.log("map : x "+map[i].x+" y "+map[i].y);
}

function collide(obj1, obj2){
	return obj1.x + obj1.width > obj2.x && 
		   obj2.x + obj2.width > obj1.x && 
		   obj1.y + obj1.height > obj2.y &&
		   obj2.y + obj2.height > obj1.y;
}

function searchMap(x, y){
	for(var i = 0; i < taille; i++){
		//console.log(x+" "+map[i].x+" "+y+" "+map[i].y);
		if((x == map[i].x && y+62 >= map[i].y) || (x == map[i].x && y-62 <= map[i].y) || (x+62 >= map[i].x && y == map[i].y) || (x-62 <= map[i].x && y == map[i].y)){
			console.log(x+" "+map[i].x+" "+y+" "+map[i].y);
			return true;
		}
	}
	return false;
}

function frameUpdate(){
	context.clearRect(0, 0, $("#main").width(), $("#main").height());
	//console.log($("#main").width()+" "+$("#main").height());

	paintMur();	

	for(var i in brushPositions){
		context.drawImage(chat,brushPositions[i].x,brushPositions[i].y);
	}

	window.requestAnimationFrame(frameUpdate);
}

frameUpdate();

socket.on('updatePosition', function(data) { 
 brushPositions = data.brushPositions;
// console.log(brushPositions[clientId].x+" "+brushPositions[clientId].y)
});
>>>>>>> a7f528e4c1ec5b501dbf0524a73ce598ecb57858
