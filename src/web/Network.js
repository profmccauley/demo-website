import Game from './Game.js';
import PlayerView from './PlayerView.js';
import WaitingRoom from './Waiting.js';



class Network{ 
	is_connected(){
		console.log("is_connected: " + js_isconnected());
		return js_isconnected() > 0;
	}
	connect(){
		console.log("Attempting to connect...");
		js_close();
		js_connect();
	}
	close(){
		js_close();
	}
	send(data){
		console.log("SEND to server: " + data);
		js_send(data);
	}
}

class Sender
{
		  constructor ()
		  {
		    this.socket = null;
		    this.path = "";
		    this.port = 8080;
		    //this.address = "sockette.net";
		    this.address = "localhost";
		    //this.address = "cs-vm-06.cs.mtholyoke.edu";
		    //this.address = "138.10.92.46";
		    this.disconnected = false;
		    this.buf = "";
		    console.log("Sender created");
		    this.connect();
		  }
		  _on_close ()
		  {
		    console.log("Disconnected!", this);
		    if (this.disconnected == false)
		    {
		      this.disconnected = true;
		    }
		    try
		    {
		      this.socket.close();
		    }
		    catch
		    {
		    }
		    this.socket = null;
		  }
		  connect ()
		  {
		    if (this.socket)
		    {
		      switch (this.socket.readyState)
		      {
		        case 0:
		        case 1:
		          return;
		      }
		    }
		    if (this.socket)
		    {
		      this.socket.onclose = this.socket.onmessage = null;
		      this.socket.close();
		      return;
		    }

		    this.socket = new WebSocket("ws://" + this.address + ":" + this.port + "/" + this.path);
		    this.socket.onclose = this._on_close.bind(this);
		    this.socket.onerror = this._on_close.bind(this);

		    this.socket.onopen = function (event) {
		      console.log("Connected!");
		    }.bind(this);

		    //receive message
		    this.socket.onmessage = function (event) {
		      process(event.data);
		    };
		  }
		  send (data)
		  {
		    if (data.length == 0) return;
		    if (!this.socket || this.socket.readyState != 1 || this.buf.length)
		    {
		      if (this.buf.length == 0) setTimeout(this.send_later.bind(this), 500);
		      this.buf += data;
		    }
		    else
		    {
		      this.send_real(data)
		    }
		  }
		  send_later ()
		  {
		    var data = this.buf;
		    this.buf = '';
		    this.send(data);
		  }
		  send_real (data)
		  {
		    try
		    {
		      this.socket.send(data);
		    }
		    catch
		    {
		      this.socket.onerror();
		    }
		  }
		  close ()
		  {
		    if (!self.socket) return;
		    self.socket.close();
		    self.socket = null;
		  }
}

var sender = null;
var net = new Network();

var status = "S";
var users = null;
var number_of_users = null;

var myCards = new Array();
var prevCards = new Array();
var currPlayer = null;
var nextPlayer = null;
var my_point = 0;

var game = null;
var playerView = null;

var join_success = 1;

var alerted = new Array();

var waitingRoom = new WaitingRoom();

		function process(text){
			//receive message
		  var message = JSON.parse(text);
		  console.log("GOT DATA from server: " + text)

		  if(message.TYPE === 'HELLO'){
		  	net.send(JSON.stringify({ "TYPE":"HELLO","name": player_name.value, "gamename": "Mount Holyoke Poker"}));
		  }
		  else if(message.TYPE === 'ERROR'){
		  	if(message.ERR === 'BADNAME'){
		  		console.log("That name isn't allowed. Try another.")
		  		join_success = 2;
		  	}
		  	else if(message.ERR === 'BADGAMECODE'){
		  		if(status === 'J'){
		  			console.log("This gamecode doesn't exist. Try another.")
		  			join_success = 3;
		  		}
		  		else{
		  			console.log("This gamecode is already taken. Try another.")
		  			join_success = 4;
		  		}
		  	}
		  	else{
		  		console.log("Disconnecting due to an error.")
		  	}
		  	net.close();
		  }
		  else if(message.TYPE === 'WELCOME'){
		  	net.send(JSON.stringify({ "TYPE":"JOIN_GAME", "size": 4, "status": status, "gamecode" : game_code.value, "allow_spectators": true}));
		  }
		  else if(message.TYPE === 'JOIN'){
		  	waitingRoom.add_player(message.user);
		  	console.log("add player: " + message.user);
		  }
		  else if(message.TYPE === 'ROOM_STATUS'){
		  	join_success = 0;
		  	users = message.users;
		  	number_of_users = message.number_of_users;
		  	console.log("Current users in this room: " + users);
		  	console.log("Number of users in this room: " + number_of_users);
		  }
		  else if(message.TYPE === 'DATA'){
		  	//Server sends back to all players of the played cards for them to update the UI
		  	if (message.msg.type === 'MOVE'){
		  		console.log("Player " + message.SENDER + " played " + message.msg.card);

		  		//host update the game
		  		if(status === 'S'){
		  			console.log("Host update the game");
		  			if(message.msg.card === 'pass'){
						game.updateGame();
					}
					else{
						game.updateGame(message.msg.card);
					}

					//check if start new round
					if(game.startNewRound === true){
						new_round();
					}
					else{
						//check if less than three cards
						if(game.lessThanThree === true){
							if(!alerted.includes(message.SENDER)){
								alerted.push(message.SENDER);
								console.log("players with less than three cards: " + alerted);
								playerView.lessThanThreeAlert(message.SENDER);
							}
						}
						//get updated info from the game
						prevCards = game.getPreviousCards(); 
						currPlayer = game.getCurrentPlayer().getName();
						console.log('in network', currPlayer);
						let nextIndex = game.getPlayers().indexOf(game.getCurrentPlayer()) + 1;
						if(nextIndex >= game.getPlayers().length){
							nextIndex = 0;
						}
						nextPlayer = game.getPlayers()[nextIndex].getName();
						console.log('in network', nextPlayer);
						//host update PlayerView
						var dict = {
						    prevCards: prevCards,
						    currPlayer: currPlayer,
						    nextPlayer: nextPlayer,	
						};
				  		playerView.updateGame(dict);

				  		//host tell others to update their playerView
				  		if(game.lessThanThree === true){
				  			net.send(JSON.stringify({ "TYPE":"DATA", "msg": {"type": 'PLAYERMOVE', "alert": true, "alert_player": message.SENDER, "prevCards": prevCards, "currPlayer": currPlayer, "nextPlayer": nextPlayer}}));
				  		}
				  		else{
				  			net.send(JSON.stringify({ "TYPE":"DATA", "msg": {"type": 'PLAYERMOVE', "alert": false, "prevCards": prevCards, "currPlayer": currPlayer, "nextPlayer": nextPlayer}}));
				  		}
					}
				}

		  	}
		 
		  	else if(message.msg.type === 'PLAYERMOVE'){
		  		console.log("other players update their screen");
		  		if(status !== 'S'){
		  			//check if less than three cards
			  		if(message.msg.alert === true){
			  			console.log("Alert in Network");
			  				playerView.lessThanThreeAlert(message.msg.alert_player);
			  		}
		  			//host update PlayerView
					var dict = {
					    prevCards: message.msg.prevCards,
					    currPlayer: message.msg.currPlayer,
					    nextPlayer: message.msg.nextPlayer,	
					};
			  		playerView.updateGame(dict);
		  		}
		  	}
		  	else if(message.msg.type === 'NEWROUND'){
		  		console.log("player out of cards! Start new round");
		  		if(status !== 'S'){
		  			//player update their playerview to start a new round
		  			for (let player of message.msg.players) {
						if (player.name === player_name.value){
							myCards = player.hand;
							my_point = player.points;
						}
					}

					var dict = {
						myCards: myCards,
					    prevCards: message.msg.prevCards,
					    currPlayer: message.msg.currPlayer,
					    nextPlayer: message.msg.nextPlayer,	
					    points: my_point,
					    players: message.msg.players,
					};
					console.log(JSON.stringify(dict));

			  		//update playerView and pass the updated dict
					playerView.updateNewRound(dict);
		  		}
		  	}
		  	// Server sends back to all players for them to start the game
		  	else if(message.msg.type === 'START'){
		  		console.log("The host " + message.SENDER + " started the game");
		
		  		if (status !== 'S'){
		  			//start game for other players
					waitingRoom.leave_waiting_room();
					//init Game in PlayerView
					console.log("*****in message 'START'", player_name.value);
					playerView = new PlayerView(player_name.value);

					//Data: myCards: init cards for current user
					//player object
					console.log(message.msg.players);
					for (let player of message.msg.players) {
						if(player.name === player_name.value){
							myCards = player.hand;
							my_point = player.points;
						}
					}
					var dict = {
						myCards: myCards,
					    prevCards: message.msg.prevCards,
					    currPlayer: message.msg.currPlayer,
					    nextPlayer: message.msg.nextPlayer,	
					    points: my_point,
					    players: message.msg.players,
					};
					console.log(JSON.stringify(dict));
					playerView.startGame(dict);	
				}

		  	}
		  	else if(message.msg.type === 'END'){
		  		console.log("The host " + message.SENDER + " ends the game");
		  		if(status !== 'S'){
		  			document.getElementById("leave_game").classList.add("offscreen");
					document.getElementById("game_screen").classList.add("offscreen");
					document.getElementById("game_over").classList.remove("offscreen");
		  		}
		  	}
		  }
		}


		export function get_join_status(){
			return join_success;
		}

		//if the new round is started
		//host update the playerView
		function new_round(){
			//clear the alerted array
			alerted = new Array();
			
			//Data: myCards: init cards for current user
			//player object
			for (let player of game.getPlayers()) {
				if(player.name === player_name.value){
					myCards = player.getHand();
					my_point = player.getPoints();
				}
			}
			prevCards = game.getPreviousCards(); 
			currPlayer = game.getCurrentPlayer().getName();
			let nextIndex = game.getPlayers().indexOf(game.getCurrentPlayer()) + 1;
			if(nextIndex >= game.getPlayers().length){
				nextIndex = 0;
			}
			nextPlayer = game.getPlayers()[nextIndex].getName();

			var dict = {
				myCards: myCards,
			    prevCards: prevCards,
			    currPlayer: currPlayer,
			    nextPlayer: nextPlayer,	
			    points: my_point,
			    players: game.getPlayers(),
			};

			//update playerView and pass the updated dict
			playerView.updateNewRound(dict);

			// send to server that the game starts
			net.send(JSON.stringify({ "TYPE":"DATA", "msg": {"type": 'NEWROUND', "players": game.getPlayers(), "prevCards": prevCards, "currPlayer": currPlayer, "nextPlayer": nextPlayer}}));
		}


		//when start game button clicked in the waiting room
		//init game in Game.js, send information to PlayerView.js
		function start_game(){
			console.log("The game starts!");
			console.log("*****in start_game", player_name.value);
			//call Game in game logic
		    var type = document.getElementById('card_types').value;
		    console.log("type: " + type);
		    var play_to = document.querySelector('input[name = "game_length"]:checked').value;
		    var playRounds = null;
		    var playPoints = null;
		    if (play_to === "play3"){
			playRounds = 3;
		    }
		    else if (play_to === "play_input_rounds"){
			var rounds = document.getElementById("insert_rounds").value;
			var roundsInt = parseInt(rounds, 10);
			if (!roundsInt===NaN){
			    playRounds = roundsInt;
			}
			else{
			    waitingRoom.show_error();
			}
		    }
		    else if (play_to === "play_input_points"){
			var points = document.getElementById("insert_points").value;
			var pointsInt = parseInt(points, 10);
			if (!pointsInt===NaN){
			    playPoints = pointsInt;
			}
			else{
			    waitingRoom.show_error();
			}
		    }
		    game = new Game(number_of_users, users, type, playRounds, playPoints);
			//init Game in PlayerView
			playerView = new PlayerView(player_name.value, true);

			//Data: myCards: init cards for current user
			//player object
			for (let player of game.getPlayers()) {
				if(player.name === player_name.value){
					myCards = player.getHand();
					my_point = player.getPoints();
				}
			}
			prevCards = game.getPreviousCards(); 
			currPlayer = game.getCurrentPlayer().getName();
			let nextIndex = game.getPlayers().indexOf(game.getCurrentPlayer()) + 1;
			if(nextIndex >= game.getPlayers().length){
				nextIndex = 0;
			}
			nextPlayer = game.getPlayers()[nextIndex].getName();

			var dict = {
				myCards: myCards,
			    prevCards: prevCards,
			    currPlayer: currPlayer,
			    nextPlayer: nextPlayer,	
			    points: my_point,
			    players: game.getPlayers(),
			};
			playerView.startGame(dict);	

			console.log(game.getPlayers());

			//send to server that the game starts
			net.send(JSON.stringify({ "TYPE":"DATA", "msg": {"type": 'START', "players": game.getPlayers(), "prevCards": prevCards, "currPlayer": currPlayer, "nextPlayer": nextPlayer}}));
		}

		//when play cards button clicked by a player in the game page
		//cards is an array of played hands
		export default function play_cards(cards = 'pass'){
			console.log("got cards" + cards);
			net.send(JSON.stringify({ "TYPE":"DATA", "msg": {"type": 'MOVE', 'card': cards}}));
		}

		//host click end game button
		function leave_game(){
			console.log("The game ends!");
			net.send(JSON.stringify({ "TYPE":"DATA", "msg": {"type": 'END'}}));
		}

		//set up JS connection through python function above
 		function js_connect (my_status)
		{
		  status = my_status;
		  console.log("Welcome to Poker Game");
		  console.log("js_connect: " + sender);
		  if (sender) sender.close();
		  sender = new Sender();

		}
		function js_close ()
		{
		  if (!sender) return;
		  console.log("js_close", sender);
		  sender.close();
		  sender = null;
		}
		function js_send (data)
		{
		  if (!sender) return;
		  sender.send(data);
		}
		function js_isconnected ()
		{
		  if (!sender) return false;
		  if (!sender.socket) return false;
		  var rs = sender.socket.readyState;
		  if (rs == 0) return 1;
		  if (rs == 1) return 2;
		  return 0;
		}

document.getElementById("start_game").addEventListener("click", function(){js_connect("S")});
document.getElementById("play_game").addEventListener("click", start_game);
document.getElementById("leave_game").addEventListener("click", leave_game);
document.getElementById("join_game").addEventListener("click", function(){js_connect("J")});
window.get_join_status = get_join_status;
