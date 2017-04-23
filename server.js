var express = require('express'); 
var app = express(); 
app.use(express.static('public')); 

var server = require('http').Server(app); 
var io = require('socket.io')(server); 

var clientsID = 0;

var brushPositions = {};
<<<<<<< HEAD
var map = [];
var ballPositions = {};
var sourisPosition = {};
var clients={};

//------------------------------------------------------------------------------

for(var i=0; i<600 ; i+=30){
	map.push({x:0, y:i, width:30, height:30});
}
for(var i=30; i<810-30 ; i+=30){
	map.push({x:i, y:0, width:30, height:30});
}
for(var i=0; i<600 ; i+=30){
	map.push({x:810-30, y:i, width:30, height:30});
} 
for(var i=30; i<810-30 ; i+=30){
	map.push({x:i, y:600-30, width:30, height:30});
}

//-----------------------------------------------------------------------------

function collide(obj1, obj2){
	return obj1.x + obj1.width > obj2.x && 
	obj2.x + obj2.width > obj1.x && 
	obj1.y + obj1.height > obj2.y &&
	obj2.y + obj2.height > obj1.y;
}

//----------------------------------------------------------------------------
function tracerBall(data){
	var pX = data.x;
	var pY = data.y;
	var cX = data.xCurseur;
	var cY = data.yCurseur;
	
	var x = cX-pX;
	var y = cY-pY;
	var l = Math.sqrt(Math.pow(x, 2)+Math.pow(y, 2));
	var rX = x/l;
	var rY = y/l;

	return [rX, rY];
	console.log(rX+"  "+rY);
}
//----------------------------------------------------------------------------
io.on('connection', function (socket) { 
	console.log("serveur> Client "+clientsID+" s'est connecte");
	var clientId = clientsID;
	var nbrpoints = 0;
	var xAlea = Math.random() * (770 - 35) + 35;
	var yAlea = Math.random() * (570 - 35) + 35;	
	
	clients[clientId] = {clientId: clientId, nbrPoints:nbrpoints};
	brushPositions[clientId] = {x:xAlea, y:yAlea};

	socket.emit('hello', {id: clientsID, x:brushPositions[clientId].x, y:brushPositions[clientId].y, type:"initialisation"});
	io.emit('newconnection',{clients: clients, brushPositions: brushPositions, type:"newclient"});
	clientsID++; 
  	//-------------------------------------------------
	socket.on('mousedown', function (data) { 	
			
		var bX = 0; 
		var bY = 0;
		var vitesse = 2;
		var coll1 = false;
		var coll2 = false;
		
		var vectElem = tracerBall(data);
		
		var myvar = setInterval(function(){
			bX =  data.x+vectElem[0]*vitesse;
			bY = data.y+vectElem[1]*vitesse;
			vitesse = vitesse+5;

			ballPositions[clientId] = {x: bX, y: bY, width: 16, height: 16};
			for(var i in brushPositions){	
				if(i != clientId){
					coll1 = collide(ballPositions[clientId],brushPositions[i]);
					if(coll1){
						break;
					}
				}	
				console.log("collision ? : "+coll1);
			}// fin for
			for(var i in map){
				coll2 = collide(ballPositions[clientId],map[i]);
				console.log("collision "+coll2);
				if(coll2){
					break;
				}
			}

			if(!coll1 && !coll2){
				io.emit('updateballPosition', {ballPositions: ballPositions,type:"uBallP",clients:clients});
				console.log("j'ai renvoyé les données");
			}else if (coll1 || coll2){
				ballPositions[clientId] = {};
				if(coll1){
					nbrpoints = nbrpoints+1;
				}
				clients[clientId]={clientId: clientId, nbrPoints:nbrpoints};
				io.emit('updateballPosition', {ballPositions: ballPositions,type:"uBallP", clients: clients});	
				clearInterval(myvar);
			}		
		},30);// fin while
	
		ballPositions[clientId]={};
	});     
        //-----------------------------------------    
	socket.on('keyupdown', function (data) { 
  	console.log("une touche à été tapé");

	var coll1 = false;
	var coll2 = false;
	var id = data.id;
	//à gauche
	if(data.keycode==37){
		brushPositions[id] = {x: data.x-10, y:data.y, width: 32, height: 32};
		for(var i in brushPositions){	
			if(i != id){

				coll2 = collide(brushPositions[id],brushPositions[i]);
				if(coll2){
					console.log("collision entre joueur  "+id+" et joueur "+i);
					brushPositions[id] = {x: data.x, y:data.y, width: 32, height: 32};
					break;
				}
			}	
		}
		if(!coll2){
			for(var i in map){
				coll1 = collide(brushPositions[id],map[i]);
				console.log("collision "+coll1);
				if(!coll1){
					brushPositions[id] = {x: data.x-10, y:data.y, width: 32, height: 32};			   
				}else{
					brushPositions[id] = {x: data.x, y:data.y, width: 32, height: 32};
					break;			
				}
			}
		}
	}
	//en haut
	if(data.keycode==38){
		brushPositions[data.id] = {x: data.x, y:data.y-10, width: 32, height: 32};
		for(var i in brushPositions){	
			if(i != id){

				coll2 = collide(brushPositions[id],brushPositions[i]);
				if(coll2){
					console.log("collision entre joueur  "+id+" et joueur "+i);
					brushPositions[id] = {x: data.x, y:data.y, width: 32, height: 32};
					break;
				}
			}	
		}	
		if(!coll2){
			for(var i in map){
				coll1 = collide(brushPositions[id],map[i]);
				console.log("collision "+coll1);
				if(!coll1){
					brushPositions[data.id] = {x: data.x, y:data.y-10, width: 32, height: 32};		   
				}else{
					brushPositions[id] = {x: data.x, y:data.y, width: 32, height: 32};
					break;			
				}
			}
		}
	}
	//à droite
	if(data.keycode==39){
		brushPositions[data.id] = {x: data.x+10, y:data.y, width: 32, height: 32};	
		for(var i in brushPositions){	
			if(i != id){

				coll2 = collide(brushPositions[id],brushPositions[i]);
				if(coll2){
					console.log("collision entre joueur  "+id+" et joueur "+i);
					brushPositions[id] = {x: data.x, y:data.y, width: 32, height: 32};
					break;
				}
			}	
		}	
		if(!coll2){
			for(var i in map){
				coll1 = collide(brushPositions[id],map[i]);
				console.log("collision "+coll1);
				if(!coll1){
					brushPositions[data.id] = {x: data.x+10, y:data.y, width: 32, height: 32};		   
				}else{
					brushPositions[id] = {x: data.x, y:data.y, width: 32, height: 32};
					break;			
				}
			}
		}
	}
	//en bas
	if(data.keycode==40){
		brushPositions[data.id] = {x: data.x, y:data.y+10, width: 32, height: 32};	
		for(var i in brushPositions){	
			if(i != id){

				coll2 = collide(brushPositions[id],brushPositions[i]);
				if(coll2){
					console.log("collision entre joueur  "+id+" et joueur "+i);
					brushPositions[id] = {x: data.x, y:data.y, width: 32, height: 32};
					break;
				}
			}	
		}	
		if(!coll2){
			for(var i in map){
				coll1 = collide(brushPositions[id],map[i]);
				console.log("collision "+coll1);
				if(!coll1){
					brushPositions[data.id] = {x: data.x, y:data.y+10, width: 32, height: 32};					   
				}else{
					brushPositions[id] = {x: data.x, y:data.y, width: 32, height: 32};
					break;			
				}
			}
		}
	}

	io.emit('updatePosition', {brushPositions: brushPositions,type:"uBrushP"});
        console.log("j'ai envoyé les nouvelles données");
 	}); 
	//--------------------------------
	socket.on('disconnect', function(){
    		socket.disconnect();
		brushPositions[clientId] = {};
		clients[clientId] = {};
		io.emit('updatePosition', {brushPositions: brushPositions,clients: clients,type:"uBrushP"});
		
	});
=======

io.on('connection', function (socket) { 
  console.log("serveur> Client "+clientsID+" s'est connecte");
  var clientId = clientsID;
  socket.emit('hello', {  id: clientsID});
  clientsID++; 

  socket.on('mousemove', function (data) { 
	  //console.log("serveur> "+socket.id+" "+socket.x+" "+socket.y);
	  var ind = searchMap(data.x, data.y, data.taille, data.map);
	  console.log(ind);
	  if(!ind)
		  brushPositions[data.id] = {x: data.x, y: data.y, width: 32, height: 32}
	  //console.log("serveur> brushPositions["+socket.id+"] = "+brushPositions[socket.id].x+" "+brushPositions[socket.id].y);
	  io.emit('updatePosition', {brushPositions: brushPositions});

function searchMap(x, y, taille, map){
	for(var i = 0; i < taille; i++){
		//console.log(x+" "+map[i].x+" "+y+" "+map[i].y);
		if((x == map[i].x && y+32 >= map[i].y) || (x == map[i].x && y-32 <= map[i].y) || (x+32 >= map[i].x && y == map[i].y) || (x-32 <= map[i].x && y == map[i].y)){
			//console.log(x+" "+map[i].x+" "+y+" "+map[i].y);
			return true;
		}
	}
	return false;
}

  }); 

  socket.on('keyupdown', function (data) { 
	  //console.log(data.id+" "+data.keycode+" "+data.x+" "+data.y);
	  var ind = searchMap(data.x, data.y, data.taille, data.map);
	  console.log(ind);
	  if(!ind){
		if(data.keycode == 37)
		  brushPositions[data.id] = {x: data.x-10, y: data.y, width: 32, height: 32}
	  	else if(data.keycode == 38)
		  brushPositions[data.id] = {x: data.x, y: data.y-10, width: 32, height: 32}
	  	else if(data.keycode == 39)
		  brushPositions[data.id] = {x: data.x+10, y: data.y, width: 32, height: 32}
	  	else if(data.keycode == 40)
		  brushPositions[data.id] = {x: data.x, y: data.y+10, width: 32, height: 32}
	  }
	 
	  io.emit('updatePosition', {brushPositions: brushPositions});

function searchMap(x, y, taille, map){
	for(var i = 0; i < taille; i++){
		//console.log(x+" "+map[i].x+" "+y+" "+map[i].y);
		if((x == map[i].x && y+32 >= map[i].y) || (x == map[i].x && y-32 <= map[i].y) || (x+32 >= map[i].x && y == map[i].y) || (x-32 <= map[i].x && y == map[i].y)){
			//console.log(x+" "+map[i].x+" "+y+" "+map[i].y);
			return true;
		}
	}
	return false;
}

  }); 
>>>>>>> a7f528e4c1ec5b501dbf0524a73ce598ecb57858

}); 

server.listen(3000, function() { 
 console.log('Example app listening on port 3000!'); 
}); 
