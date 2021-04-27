import Game from './Game.js';
import PlayerView from './PlayerView.js';
// import leave_waiting_room from './Waiting.js';
// import add_player from './Waiting.js';
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
		      //echo("Disconnected.  Press Enter to try reconnecting.");
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

		    //echo("Connecting to server...");

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

var error = null;
var join_success = false;

var type = document.getElementById('card_types').value;

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
				  error = "That name isn't allowed. Try another.";
		  	}
		  	else if(message.ERR === 'BADGAMECODE'){
		  		if(status === 'J'){
		  			console.log("This gamecode doesn't exist. Try another.")
					  error = "This gamecode doesn't exist. Try another.";
		  		}
		  		else{
		  			console.log("This gamecode is already taken. Try another.")
					  error = "This gamecode is already taken. Try another.";
		  		}
		  	}
		  	else{
		  		console.log("Disconnecting due to an error.")
		  	}
		  	net.close();
		  }
		  else if(message.TYPE === 'WELCOME'){
		  	//console.log("Now you can join a game");
		  	net.send(JSON.stringify({ "TYPE":"JOIN_GAME", "size": 4, "status": status, "gamecode" : game_code.value, "allow_spectators": true}));
		  }
		  else if(message.TYPE === 'JOIN'){
		  	waitingRoom.add_player(message.user);
		  	console.log("add player: " + message.user);
		  }
		  else if(message.TYPE === 'ROOM_STATUS'){
		  	join_success = true;
		  	users = message.users;
		  	number_of_users = message.number_of_users;
		  	console.log("Current users in this room: " + users);
		  	console.log("Number of users in this room: " + number_of_users);
		  	//is_ready: len(self.members) >= self.room_size
		  	// if(message.is_ready === true){
		  	// 	//start the game
		  	// 	start_game(users);
		  	// }
		  	// if(number_of_users === 2){
		  	// 	start_game();
		  	// }

		  	//temp test
		  	//net.send(JSON.stringify({ "TYPE":"DATA", "msg": {"type": 'MOVE', 'card': [1,2,3]}}));
		  }
		  else if(message.TYPE === 'DATA'){
		  	//Server sends back to all players of the played cards for them to update the UI
		  	if (message.msg.type === 'MOVE'){
		  		console.log("Player " + message.SENDER + " played " + message.msg.card);
		  		//call update UI
		  	}
		  	//Server sends back to all players for them to start the game
		  	else if(message.msg.type === 'START'){
		  		console.log("The host " + message.SENDER + " started the game");
		
		  		if (status !== 'S'){
					waitingRoom.leave_waiting_room();
					//init Game in PlayerView
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
					};
					console.log(JSON.stringify(dict));
					playerView.startGame(dict);	
				}

		  	}
		  }
		}

		export function get_join_status(){
			return join_success;
		}


		//when start game button clicked in the waiting room
		//init game in Game.js, send information to PlayerView.js
		function start_game(){
			console.log("The game starts!");
			//call Game in game logic
			game = new Game(number_of_users, users);
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
			let nextIndex = game.getPlayers().indexOf(currPlayer) + 1;
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
			};
			playerView.startGame(dict);	

			console.log(game.getPlayers());

			//send to server that the game starts
			net.send(JSON.stringify({ "TYPE":"DATA", "msg": {"type": 'START', "players": game.getPlayers(), "prevCards": prevCards, "currPlayer": currPlayer, "nextPlayer": nextPlayer}}));
		}

		//when play cards button clicked by a player in the game page
		//cards is an array of played hands
		export default function play_cards(cards){
			console.log("got cards" + cards);
			//TODO: is it reasonable to updateGame here?
			game.updateGame(cards);
			net.send(JSON.stringify({ "TYPE":"DATA", "msg": {"type": 'MOVE', 'card': cards}}));
		}

////set up JS connection through python function above
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
document.getElementById("join_game").addEventListener("click", function(){js_connect("J")});
window.get_join_status = get_join_status;
