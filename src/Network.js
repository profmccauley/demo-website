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
		    this.address = "0.0.0.0";
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

var status = null;
var users = null;
var number_of_users = null;

var playingOrder = null;
var hand = null;

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
		  	}
		  	else if(message.ERR === 'BADGAMECODE'){
		  		if(status === 'J'){
		  			console.log("This gamecode doesn't exist. Try another.")
		  		}
		  		else{
		  			console.log("This gamecode is already taken. Try another.")
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
		  else if(message.TYPE === 'ROOM_STATUS'){
		  	users = message.users;
		  	number_of_users = message.number_of_users;
		  	console.log("Current users in this room: " + users);
		  	console.log("Number of users in this room: " + number_of_users);
		  	//is_ready: len(self.members) >= self.room_size
		  	// if(message.is_ready === true){
		  	// 	//start the game
		  	// 	start_game(users);
		  	// }

		  	//temp test
		  	//net.send(JSON.stringify({ "TYPE":"DATA", "msg": {"type": 'MOVE', 'player': player_name.value, 'card': [1,2,3]}}));
		  }
		  else if(message.TYPE === 'DATA'){
		  	//Server sends back to all players of the played cards for them to update the UI
		  	if (message.msg.type === 'MOVE'){
		  		console.log("Player " + message.msg.player + " played " + message.msg.card);
		  		//update UI
		  	}
		  }
		}


		// let game = new Game(number_of_users, users);
		// //when start game button clicked in the waiting room
		// function start_game(){
		// 	//call Game in game logic
		// 	//init game
		// 	game.startGame();
		// 	// // start with player with the lowest card
		// 	// let firstPlayer = game.currentPlayer;

		// 	//TODO: get playing order, is it defined by the Game logic?
		// 	playingOrder = game.playerOrder;

		// 	//player object
		// 	//init cards for current user
		// 	for (let player of game.players) {
		// 		if(player.name === player_name.value){
		// 			hand = player.getHand();
		// 		}
		// 	}
		// }

		// //when play hands button clicked by a player in the game page
		// //cards in an array of played hands
		// function play_hands(cards){
		// 	//check validity of the current played cards
		// 	try (game.rules.isValid(cards)){
		// 		//update current player???
		// 		game.updateGame(cards);
		// 		//send it to the server
		// 		net.send(JSON.stringify({ "TYPE":"DATA", "msg": {"type": 'MOVE', 'player': player_name.value, 'card': cards}}));
		// 	} catch(err) {
		// 		console.log("Error message: " + err);
		// 	}
		// }

		////set up JS connection through python function above
		function js_connect (status)
		{
		  this.status = status;
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